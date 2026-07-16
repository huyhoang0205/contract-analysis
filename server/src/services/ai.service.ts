import { redis } from "../config/redis";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import OpenAI from "openai";

export const AI_MODEL = "gemini-2.5-flash";

const client = new OpenAI({
  baseURL: "https://aiapiv2.pekpik.com/v1",
  apiKey: process.env.OPEN_AI_SECRET!,
});

export const extractTextFromPDF = async (fileKey: string) => {
  try {
    const fileData = await redis.get(fileKey);

    if (!fileData) {
      throw new Error("File not found");
    }

    let fileBuffer: Uint8Array;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = new Uint8Array(fileData);
    } else if (typeof fileData === "object" && fileData !== null) {
      // check if the object has expected structure
      const bufferData = fileData as { type?: string; data?: number[] };
      if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
        fileBuffer = new Uint8Array(bufferData.data);
      } else {
        throw new Error("Invalid file data");
      }
    } else {
      throw new Error("Invalid file data");
    }

    const pdf = await getDocument({ data: fileBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join("") + "\n";
    }

    return text;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to extract text from PDF. Error : ${JSON.stringify(error)}`,
    );
  }
};

export const detectContractType = async (
  contractText: string,
): Promise<string> => {
  const prompt = `
    Hãy phân tích đoạn văn bản hợp đồng sau đây và xác định loại hợp đồng.
    Chỉ cung cấp loại hợp đồng dưới dạng một chuỗi văn bản duy nhất (ví dụ: "Lao động", "Thỏa thuận bảo mật thông tin", "Mua bán", "Thuê nhà", v.v.).
    Không bao gồm bất kỳ lời giải thích hoặc văn bản bổ sung nào.

    Văn bản hợp đồng:
    ${contractText.substring(0, 2000)}`;

  const results = await client.responses.create({
    model: "deepseek-chat",
    input: prompt,
  });

  console.log(results);

  const response = results
    ? results.output_text.trim()
    : "Something with wrong with response of genAI";

  return response;
};

export interface IRisk {
  risk: string;
  explanation: string;
}

export interface IOpportunity {
  opportunity: string;
  explanation: string;
}

export interface FallbackAnalysis {
  risks: IRisk[];
  opportunities: IOpportunity[];
  summary: string;
}

export const analyzeContractWithAI = async (
  contractText: string,
  tier: "free" | "premium",
  contractType: string,
) => {
  let prompt;
  if (tier === "premium") {
    prompt = `
      Hãy phân tích hợp đồng ${contractType} sau đây và cung cấp:
      1. Danh sách ít nhất 10 rủi ro tiềm ẩn đối với bên nhận hợp đồng (người lao động), mỗi rủi ro kèm theo giải thích ngắn gọn và mức độ nghiêm trọng (thấp, trung bình, cao).
      2. Danh sách ít nhất 10 cơ hội hoặc lợi ích tiềm ẩn cho bên nhận hợp đồng, mỗi cơ hội kèm theo giải thích ngắn gọn và mức độ tác động (thấp, trung bình, cao).
      3. Bản tóm tắt toàn diện về hợp đồng, bao gồm các điều khoản và điều kiện chính.
      4. Bất kỳ kiến nghị nào nhằm cải thiện hợp đồng dưới góc nhìn của bên nhận hợp đồng.
      5. Danh sách các điều khoản chính trong hợp đồng.
      6. Đánh giá về tính tuân thủ pháp lý của hợp đồng.
      7. Danh sách các điểm tiềm ẩn có thể thương lượng.
      8. Thời hạn hoặc thời gian của hợp đồng, nếu có.
      9. Tóm tắt các điều kiện chấm dứt hợp đồng, nếu có.
      10. Bảng phân rã các điều khoản tài chính hoặc cấu trúc tiền lương/bồi thường, nếu có.
      11. Bất kỳ chỉ số hiệu suất hoặc KPI nào được đề cập, nếu có.
      12. Tóm tắt các điều khoản cụ thể liên quan đến loại hợp đồng này (ví dụ: sở hữu trí tuệ đối với hợp đồng lao động, bảo hành đối với hợp đồng mua bán).
      13. Điểm số tổng thể từ 1 đến 100, với 100 là cao nhất. Điểm số này đại diện cho mức độ thuận lợi tổng thể của hợp đồng dựa trên các rủi ro và cơ hội đã xác định.
      14. Định dạng phản hồi của bạn dưới dạng một đối tượng JSON với cấu trúc như sau:
      {
        "risks": [{"risk": "Risk description", "explanation": "Brief explanation", "severity": "low|medium|high"}],
        "opportunities": [{"opportunity": "Opportunity description", "explanation": "Brief explanation", "impact": "low|medium|high"}],
        "summary": "Comprehensive summary of the contract",
        "recommendations": ["Recommendation 1", "Recommendation 2", ...],
        "keyClauses": ["Clause 1", "Clause 2", ...],
        "legalCompliance": "Assessment of legal compliance",
        "negotiationPoints": ["Point 1", "Point 2", ...],
        "contractDuration": "Duration of the contract, if applicable",
        "terminationConditions": "Summary of termination conditions, if applicable",
        "overallScore": "Overall score from 1 to 100",
        "financialTerms": {
          "description": "Overview of financial terms",
          "details": ["Detail 1", "Detail 2", ...]
        },
        "performanceMetrics": ["Metric 1", "Metric 2", ...],
        "specificClauses": "Summary of clauses specific to this contract type"
    `;

    prompt += `
      Important: Provide only the JSON object in your response, without any additional text or formatting. 
      Contract text:
      ${contractText}
      `;
  } else {
    prompt = `
    
    `;
  }

  const results = await client.responses.create({
    model: "deepseek-chat",
    input: prompt as string,
  });

  let text = results.output_text
    ? results.output_text.trim()
    : "Something with wrong with response of genAI";

  console.log("analyze contract with ai:::", text);
  // remove any markdown formatting
  text = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    // Attempt to fix common JSON error
    text = text.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // Ensure all keys are quoted
    text = text.replace(/:\s*"([^"]*)"([^,}\]])/g, ': "$1"$2'); // Ensure all string values are properly quoted
    text = text.replace(/,\s*}/g, "}"); // Remove trailing commas

    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const fallbackAnalysis: FallbackAnalysis = {
    risks: [],
    opportunities: [],
    summary: "Error analyzing contract",
  };

  // Extract risk
  const ricksMatch = text.match(/"risks"\s*:\s*\[([\s\S]*?)\]/);
  if (ricksMatch && ricksMatch[1]) {
    const ricksBlock = ricksMatch[1]?.split("},").filter(Boolean);
    fallbackAnalysis.risks = ricksBlock.map((risk) => {
      const riskMatch = risk.match(/"risk"\s*:\s*"([^"]*)"/);
      const explanationMatch = risk.match(/"explanation"\s*:\s*"([^"]*)"/);
      return {
        risk: riskMatch && riskMatch[1] ? riskMatch[1] : "Unknown",
        explanation:
          explanationMatch && explanationMatch[1]
            ? explanationMatch[1]
            : "Unknown",
      };
    });
  }

  //Extact opportunities
  const opportunitiesMatch = text.match(/"opportunities"\s*:\s*\[([\s\S]*?)\]/);
  if (opportunitiesMatch && opportunitiesMatch[1]) {
    const opportunitiesBlock = opportunitiesMatch[1]
      ?.split("},")
      .filter(Boolean);
    fallbackAnalysis.opportunities = opportunitiesBlock.map((opportunity) => {
      const opportunityMatch = opportunity.match(
        /"opportunity"\s*:\s*"([^"]*)"/,
      );
      const explanationMatch = opportunity.match(
        /"explanation"\s*:\s*"([^"]*)"/,
      );
      return {
        opportunity:
          opportunityMatch && opportunityMatch[1]
            ? opportunityMatch[1]
            : "Unknown",
        explanation:
          explanationMatch && explanationMatch[1]
            ? explanationMatch[1]
            : "Unknown",
      };
    });
  }

  // Extract summary
  const summaryMatch = text.match(/"summary"\s*:\s*"([^"]*)"/);
  if (summaryMatch && summaryMatch[1]) {
    fallbackAnalysis.summary = summaryMatch[1];
  }

  return fallbackAnalysis;
};
