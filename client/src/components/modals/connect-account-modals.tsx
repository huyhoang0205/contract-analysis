"use client";

import { useModalStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

function googleSignIn(): Promise<void> {
  return new Promise((resolve) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    resolve();
  });
}

export function ConnectAccountModal() {
  const [isAgreed, setIsAgreed] = useState(false);
  const modalKey = "connectAccountModal";
  const { isOpen, closeModals } = useModalStore();

  const mutation = useMutation({
    mutationFn: googleSignIn,
    onSuccess: () => {
      closeModals(modalKey);
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  const handleGoogleSignIn = async () => {
    if (isAgreed) {
      mutation.mutate();
    } else {
      toast.error("Vui lòng đồng ý với các điều khoản và điều kiện.");
    }
  };
  return (
    <Dialog
      open={isOpen(modalKey)}
      onOpenChange={() => closeModals(modalKey)}
      key={modalKey}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kết nối tài khoản Google</DialogTitle>
          <DialogDescription>
            Vui lòng kết nối tài khoản Google của bạn để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={!isAgreed || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <>Đăng nhập bằng Google</>
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(!!checked)}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-500 leading-none peerd-disabled:cursor-not-allowed peer-disabled:opacity-50"
            >
              Tôi đồng ý với các điều khoản và điều kiện.
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
