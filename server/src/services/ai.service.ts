import { redis } from "../config/redis";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { GoogleGenAI } from "@google/genai";

export const AI_MODEL = "gemini-3.5-flash";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_SECRET! });

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
    Analyze the following contract text and determine the type of contract it is.
    Provide only the contract type as a single string (e.g., "Employment", "Non-Disclosure Agreement", "Sales", "Lease", etc.).
    Do not include any additional explanation or text.

    Contract text:
    ${contractText.substring(0, 2000)}`;

  const results = await genAI.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
  });

  const response = results.text
    ? results.text.trim()
    : "Something with wrong with response of genAI";

  return response;
};

export const analyzeContractWithAI = async (
  contractText: string,
  contractType: string,
) => {
  let prompt = `
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 10 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 10 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

    Format your response as a JSON object with the following structure:
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

    const results = await genAI.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
    });

    const response = results.text? results.text.trim() : "Something with wrong with response of genAI";

    return response;
};
