import { ContractAnalysis } from "@/interfaces/contract.interface";
import { useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface IContractAnalysisResultsProps {
  analysisResults: ContractAnalysis;
  isActive: boolean;
  contractId: string;
}

export default function ContractAnalysisResults({
  analysisResults,
  isActive,
  contractId,
}: IContractAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const getScore = () => {
    const score = analysisResults?.overallScore || 54;
    if (score > 70)
      return { icon: ArrowUp, color: "text-green-500", text: "Good" };
    if (score < 50)
      return { icon: ArrowDown, color: "text-red-500", text: "Bad" };
    return { icon: Minus, color: "text-yellow-500", text: "Average" };
  };

  const scoreTrend = getScore();

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
      opportunities: type === "risks" ? "Hidden Opportunity1" : undefined,
      explanation: "Hidden Explanation1",
      severity: "low",
      impact: "low",
    };

    return (
      <ul>
        {displayItems.map((item, index) => (
          <motion.li key={index}>
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-lg">
                {
                  type === "risks"? item.risks : item.opportunities
                }
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
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
          <CardTitle>Overal Contract Score</CardTitle>
          <CardDescription>
            Based on risks and opprtunities identified{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold">
                  {analysisResults?.overallScore ?? 54}
                </div>
                <div className={`flex items-center ${scoreTrend.color}`}>
                  <scoreTrend.icon className="size-6 mr-1" />
                  <span className="font-semibold">{scoreTrend.text}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk</span>
                  <span>34%</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Opportunities</span>
                  <span>34%</span>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  This score represents the overall risk and opportunities
                  identified in the contract
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="w-full h-full max-w-xs overflow-hidden">
                <OverallScoreChart
                  overallScore={analysisResults?.overallScore ?? 73}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Contract Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                This is a summary of the contract.
                {/* {analysisResults.summary} */}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Risks</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRisksAndOpportunities(
                [
                  {
                    risks: "Hidden Risk1",
                    explanation: "Hidden Explanation1",
                    severity: "low",
                    impact: "low",
                  },
                  {
                    risks: "Hidden Risk2",
                    explanation: "Hidden Explanation2",
                    severity: "low",
                    impact: "low",
                  },
                  {
                    risks: "Hidden Risk3",
                    explanation: "Hidden Explanation3",
                    severity: "low",
                    impact: "low",
                  },
                ],
                "risks",
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
