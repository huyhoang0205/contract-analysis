"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSubcription } from "@/hooks/useSubcription";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Setting() {
  const { subcriptionStatus, setLoading } = useSubcription();

  const { user } = useCurrentUser();

  if (!subcriptionStatus) {
    return null;
  }

  const isActive = subcriptionStatus.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get(
          "/payment/create-checkout-session/vnpay",
        );
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

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân </CardTitle>
            <CardDescription>Thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input
                value={user.displayName}
                id="name"
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Gmail</Label>
              <Input
                value={user.email}
                id="email"
                readOnly
                className="bg-gray-100"
              />
            </div>
            <p>
              Tài khoản của bạn được quản lý thông qua Google. Nếu bạn muốn thay
              đổi email, vui lòng liên hệ với chúng tôi.
            </p>
          </CardContent>
        </Card>

        {isActive ? (
          <Card>
            <CardHeader>
              <CardTitle>Gói Premium</CardTitle>
              <CardDescription>Thông tin thành viên của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md bg-green-600/10 p-1 pr-2 text-xs font-medium text-green-600">
                    <div className="m-0.5 rounded-full bg-green-600 p-0.75">
                      <Check size={16} className="text-foreground" />
                    </div>
                    Active membership
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quyền thành viên trọn đời.
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p>
                  Cảm ơn sự ủng hộ của bạn. Hãy tận hưởng những ưu đãi của gói
                  cao cấp.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Nhận quyền truy cập không giới hạn mãi mãi</CardTitle>
              <CardDescription>
                Nâng cấp lên gói cao cấp và tận hưởng quyền truy cập không giới
                hạn vào tất cả các tính năng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-foreground" />
                  <p>Truy cập không giới hạn vào tất cả các tính năng</p>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-foreground" />
                  <p>Truy cập không giới hạn vào tất cả các tính năng</p>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-foreground" />
                  <p>Truy cập không giới hạn vào tất cả các tính năng</p>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpgrade} variant="outline">
                Mua tư cách thành viên trọn đời
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
