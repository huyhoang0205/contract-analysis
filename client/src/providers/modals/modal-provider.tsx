import { ConnectAccountModal } from "@/components/modals/connect-account-modals";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ConnectAccountModal />
    </>
  );
}
