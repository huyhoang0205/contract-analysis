"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-results";
import EmptyState from "@/components/analysis/empty-state";
import { useSubcription } from "@/hooks/useSubcription";
import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/zustand";
import { toast } from "sonner";

export default function ContractResultsPage() {
  const analysisResults = useContractStore(
    (state) => state.analysisResults,
  ) as ContractAnalysis;

  const { subcriptionStatus, setLoading } = useSubcription();

  if (!subcriptionStatus) {
    return <div>Loading...</div>;
  }

  const isActive = subcriptionStatus.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get("/payment/create-checkout-session/vnpay");
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      } catch {
        toast.error("Vui lòng thử lại hoặc đăng nhập vào tài khoản của bạn.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Bạn đã đã đăng ký gói thành viên");
    }
  };

  if (!analysisResults) {
    return <EmptyState title="Chưa có phân tích!" description="Vui lòng tải lên hợp đồng để phân tích" />;
  }

  return (
    <ContractAnalysisResults
      contractId={analysisResults?._id}
      isActive={isActive}
      analysisResults={analysisResults}
      onUpgrade={handleUpgrade}
    />
  );
}
