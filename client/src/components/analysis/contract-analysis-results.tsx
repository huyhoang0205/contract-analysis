import { ContractAnalysis } from "@/interfaces/contract.interface";
import { ReactNode, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IContractAnalysisResultsProps {
  analysisResults: ContractAnalysis;
  isActive: boolean;
  contractId: string;
  onUpgrade: () => void;
}

export default function ContractAnalysisResults({
  analysisResults,
  isActive,
  onUpgrade,
}: IContractAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysisResults) {
    return <div>Chưa có kết quả!</div>;
  }

  const getScore = () => {
    const score = analysisResults.overallScore;
    if (score > 70)
      return { icon: ArrowUp, color: "text-green-500", text: "Tốt" };
    if (score < 50)
      return { icon: ArrowDown, color: "text-red-500", text: "Xấu" };
    return { icon: Minus, color: "text-yellow-500", text: "Trung bình" };
  };

  const scoreTrend = getScore();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const renderRisksAndOpportunities = (
    items: Array<{
      risks?: string;
      opportunities?: string;
      explanation?: string;
      severity?: string;
      impact?: string;
    }>,
    type: "risks" | "opportunities",
  ) => {
    const displayItems = isActive ? items : items.slice(0, 3);
    const fakeItems = {
      risk: type === "risks" ? "Hidden Risk1" : undefined,
      opportunities:
        type === "opportunities" ? "Hidden Opportunity1" : undefined,
      explanation: "Hidden Explanation1",
      severity: "low",
      impact: "low",
    };

    return (
      <ul className="space-y-4">
        {displayItems.map((item, index) => (
          <motion.li
            key={index}
            className="border rounder-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-lg">
                {type === "risks" ? item.risks : item.opportunities}
              </span>
              {(item.severity || item.impact) && (
                <Badge
                  className={
                    type === "risks"
                      ? getSeverityColor(item.severity!)
                      : getImpactColor(item.impact!)
                  }
                >
                  {(item.severity || item.impact)?.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-gray-600">
              {type === "risks" ? item.explanation : item.explanation}
            </p>
          </motion.li>
        ))}

        {!isActive && items.length > 3 && (
          <motion.li
            className="border rounder-lg p-4 blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: displayItems.length * 0.1 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-lg">
                {type === "risks" ? fakeItems.risk : fakeItems.opportunities}
              </span>
              <Badge>
                {(fakeItems.severity || fakeItems.impact)?.toUpperCase()}
              </Badge>
            </div>
          </motion.li>
        )}
      </ul>
    );
  };

  const renderPremiumAccordion = (content: ReactNode) => {
    if (isActive) {
      return content;
    }

    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-between">
          <Button onClick={onUpgrade} variant="outline">
            Nâng cấp gói hội viên
          </Button>
          <div className="opacity-50">{content}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analysis Result</h1>
        <div className="flex space-x-2">{/* ASK AI BUTTON */}</div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Điểm tổng hợp</CardTitle>
          <CardDescription>
            Dựa trên các rủi ro và cơ hội đã được xác định.{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold">
                  {analysisResults.overallScore ?? 0}
                </div>
                <div className={`flex items-center ${scoreTrend.color}`}>
                  <scoreTrend.icon className="size-6 mr-1" />
                  <span className="font-semibold">{scoreTrend.text}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rủi ro</span>
                  <span>{100 - analysisResults.overallScore}%</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Cơ hội</span>
                  <span>{analysisResults.overallScore}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Điểm số này thể hiện rủi ro và cơ hội tổng thể được xác định
                  trong hợp đồng
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="w-full h-full max-w-xs overflow-hidden">
                <OverallScoreChart
                  overallScore={analysisResults.overallScore}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Tóm tắt</TabsTrigger>
          <TabsTrigger value="risks">Rửi ro</TabsTrigger>
          <TabsTrigger value="opportunities">Cơ hội</TabsTrigger>
          <TabsTrigger value="details">Chi tiết</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Contract Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                {analysisResults.summary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-3xl">Risks</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRisksAndOpportunities(analysisResults.risks, "risks")}

              {!isActive && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Nâng cấp lên gói Premium để xem tất cả các rủi ro.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-3xl">
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderRisksAndOpportunities(
                analysisResults.opportunities,
                "opportunities",
              )}
              {!isActive && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Nâng cấp lên gói Premium để xem tất cả các tùy chọn.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          {isActive ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết hợp đồng</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.keyClauses.map((keyClause, index) => (
                      <motion.li className="flex items-center" key={index}>
                        {keyClause}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Các khuyến nghị</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.recommendations.map(
                      (recommendation, index) => (
                        <motion.li key={index} className="flex items-center">
                          {recommendation}
                        </motion.li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết hợp đồng</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nâng cấp lên gói Premium để xem phân tích chi tiết hợp đồng,
                  bao gồm các điều khoản chính và khuyến nghị
                </p>
                <Button
                  onClick={onUpgrade}
                  variant={"outline"}
                  className="mt-4"
                >
                  Nâng cấp lên gói Premium
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Accordion type="single" collapsible className="mb-6">
        {renderPremiumAccordion(
          <>
            <AccordionItem value="contract-details">
              <AccordionTrigger>Chi tiết hợp đồng</AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Thời hạn và kết thúc</h3>
                    <p>{analysisResults.contractDuration}</p>
                    <strong>Termination Conditions</strong>
                    <p>{analysisResults.terminationConditions}</p>
                  </div>
                  <div className="">
                    <h3 className="font-semibold mb-2">Thông tin pháp lý</h3>
                    <p>
                      <strong>Legal Compliance</strong>
                      {analysisResults.legalCompliance}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>,
        )}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Điểm đàm phán</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-2">
            {analysisResults.negotiationPoints?.map((point, index) => (
              <li className="flex items-center" key={index}>
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
