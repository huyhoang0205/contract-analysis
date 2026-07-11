"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface IContractResultsProps {
  contractId: string;
}

export default function ContractResults({ contractId }: IContractResultsProps) {
  const { user } = useCurrentUser();
  const [analysisResutls, setAnalysisResults] =
    useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !contractId) return;
    let ignore = false;
    const fetchAnalysisResults = async (id: string) => {
      try {
        const response = await api.get(`/contract/contract/${id}`);
        if (!ignore) {
          console.log(response.data);
          setAnalysisResults(response.data);
          setError(false);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisResults(contractId);

    return () => {
      ignore = true;
    };
  }, [user, contractId]);

  if (analysisResutls && Object.keys(analysisResutls).length > 0) {
    return (
      <ContractAnalysisResults
        contractId={contractId}
        analysisResults={analysisResutls}
        isActive={true}
      />
    );
  }

  if (loading) {
    return <div>Đang tải kết quả phân tích...</div>;
  }

  if (error) {
    console.log("error", error);
    return notFound();
  }
}
