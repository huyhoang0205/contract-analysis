"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import { ContractAnalysis } from "@/interfaces/contract.interface";
import { useContractStore } from "@/store/zustand";

export default function ContractResultsPage() {
  const analysisResults = useContractStore(
    (state) => state.analysisResults,
  ) as ContractAnalysis;
  return (
    <ContractAnalysisResults
      contractId={analysisResults?._id}
      isActive={false}
      analysisResults={analysisResults}
    />
  );
}
