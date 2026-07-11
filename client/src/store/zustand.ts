import { create } from "zustand";

interface ContractStore {
  analysisResults: unknown;
  setAnalysisResults: (result: unknown) => void;
}

const useContractStore = create<ContractStore>((set) => ({
  analysisResults: undefined,
  setAnalysisResults: (result) => set({ analysisResults: result }),
}));

type ModalState = {
  modals: Record<string, boolean>;
  openModals: (key: string) => void;
  closeModals: (key: string) => void;
  isOpen: (key: string) => boolean;
};

const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  openModals: (key: string) => {
    set((state) => ({ modals: { ...state.modals, [key]: true } }));
  },
  closeModals: (key: string) => {
    set((state) => ({ modals: { ...state.modals, [key]: false } }));
  },
  isOpen: (key: string) => Boolean(get().modals[key]),
}));

export { useContractStore, useModalStore };
