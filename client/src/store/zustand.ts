import { create } from "zustand";

interface ContractStore {
  analysisResult: unknown;
  setAnalysisResult: (result: unknown) => void;
}

const useContractStore = create<ContractStore>((set) => ({
  analysisResult: undefined,
  setAnalysisResult: (result) => set({ analysisResult: result }),
}));

export { useContractStore };
