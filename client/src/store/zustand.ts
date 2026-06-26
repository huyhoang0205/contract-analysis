import { create } from "zustand";

interface ContractStore {
  analysisResults: unknown;
  setAnalysisResults: (result: unknown) => void;
}

const useContractStore = create<ContractStore>((set) => ({
  analysisResults: undefined,
  setAnalysisResults: (result) => set({ analysisResults: result }),
}));

export { useContractStore };
