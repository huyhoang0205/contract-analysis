"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Loader2, LockIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useModalStore } from "@/store/zustand";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center">
          <Loader2 className="size-4 mr-2 animate-spin" />
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AuthCard />
      </div>
    );
  }
  return <>{children}</>;
}

export default function AuthCard() {
  const {openModals} = useModalStore();
  return (
    <Card className="w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/4 bg-primary/10 flex items-center justify-center p-4">
          <LockIcon className="size-16 text-primary" />
        </div>
        <div className="sm:w-3/4 p-4">
          <CardHeader className="space-y-1 px-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Yêu cầu xác thực
            </CardTitle>
            <CardDescription>
              Bạn cần đăng nhập để truy cập trang này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => openModals("connectAccountModal")}
              >
                Tiếp tục với Google
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full " variant="outline">
                  Trở về trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
