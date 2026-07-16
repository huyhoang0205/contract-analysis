import { cn } from "@/lib/utils";
import {
  ArrowRight,
  FileSearch,
  Globe,
  Hourglass,
  PiggyBank,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    title: "Phân tích dựa trên trí tuệ nhân tạo",
    description:
      "Tận dụng trí tuệ nhân tạo tiên tiến để phân tích hợp đồng một cách nhanh chóng và chính xác.",
    icon: FileSearch,
  },
  {
    title: "Nhận diện rủi ro",
    description:
      "Nhận diện các rủi ro và cơ hội tiềm ẩn trong hợp đồng của bạn.",
    icon: ShieldCheck,
  },
  {
    title: "Đơn giản hóa",
    description:
      "Tăng tốc quá trình đàm phán bằng những phân tích chuyên sâu dựa trên trí tuệ nhân tạo.",
    icon: Hourglass,
  },
  {
    title: "Giảm chi phí",
    description: "Giảm đáng kể chi phí pháp lý thông qua tự động hóa.",
    icon: PiggyBank,
  },
  {
    title: "Tuân thủ pháp luật ",
    description:
      "Đảm bảo các hợp đồng của bạn đáp ứng đầy đủ các yêu cầu pháp lý.",
    icon: Scale,
  },
  {
    title: "Tiết kiệm thời gian",
    description:
      "Hoàn tất việc xem xét hợp đồng chỉ trong vài phút thay vì hàng giờ.",
    icon: Zap,
  },
];

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-linear-to-b from-background to-background/80">
      <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl mx-auto">
        <Link
          href={"/dashboard"}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "px-4 py-2 mb-4 rounded-full hidden md:flex",
          )}
        >
          <span className="mr-3 hidden md:block">
            <Sparkles className="size-3.5" />
          </span>
          Tối ưu hợp đồng
        </Link>
        <div className="text-center mb-12 w-full">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary mb-4">
            Nâng tầm hợp đồng của bạn
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Tận dụng sức mạnh của trí tuệ nhân tạo để phân tích, hiểu và tối ưu
            hóa các hợp đồng của bạn một cách nhanh chóng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="inline-flex items-center justify-center text-lg"
              size={"lg"}
            >
              <Link href={"/dashboard"}>Bắt đầu</Link>
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              className="inline-flex items-center justify-center text-lg"
              size={"lg"}
              variant={"outline"}
            >
              Tìm hiểu thêm
              <Globe className="ml-2 size-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
