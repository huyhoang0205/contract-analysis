"use client";

import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export function PricingSection() {
  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payment/create-checkout-session");
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-linear-to-b from-background to-background/80">
      <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
        Hãy chọn gói dịch vụ phù hợp với bạn.
      </h2>
      <p className="text-lg text-muted-foreground mt-4 text-center max-w-3xl mx-auto">
        Chọn gói dịch vụ phù hợp nhất với nhu cầu của bạn. Nâng cấp bất cứ lúc
        nào để mở khóa các tính năng và hỗ trợ cao cấp.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard
          title="Basic"
          description="Bao gồm các tính năng cơ bản có giới hạn"
          price="Free"
          period="/trọn đời"
          features={[
            "Phân tích hợp đồng nâng cao",
            "Số lượng dự án không giới hạn",
            "Hơn 10 rủi ro với mức độ nghiêm trọng",
            "Hơn 10 cơ hội với mức độ tác động",
            "Tóm tắt hợp đồng toàn diện",
            "Đề xuất cải tiến",
            "Xác định các điều khoản chính",
            "Đánh giá tuân thủ pháp luật",
            "Điểm đàm phán",
            "Phân tích thời hạn hợp đồng",
            "Tóm tắt điều kiện chấm dứt hợp đồng",
            "Phân tích chi tiết cấu trúc bồi thường",
            "Xác định các chỉ số hiệu suất",
            "Tóm tắt điều khoản sở hữu trí tuệ",
          ]}
          buttonText=""
          onButtonClick={handleUpgrade}
        />
        <PricingCard
          title="Premium"
          description="Phân tích hợp đồng toàn diện"
          price="10.000VND"
          highlight
          period="/trọn đời"
          features={[
            "Phân tích hợp đồng nâng cao",
            "Số lượng dự án không giới hạn",
            "Trò chuyện với hợp đồng của bạn",
            "Hơn 10 rủi ro với mức độ nghiêm trọng",
            "Hơn 10 cơ hội với mức độ tác động",
            "Tóm tắt hợp đồng toàn diện",
            "Đề xuất cải tiến",
            "Xác định các điều khoản chính",
            "Đánh giá tuân thủ pháp luật",
            "Điểm đàm phán",
            "Phân tích thời hạn hợp đồng",
            "Tóm tắt điều kiện chấm dứt hợp đồng",
            "Phân tích chi tiết cấu trúc bồi thường",
            "Xác định các chỉ số hiệu suất",
            "Tóm tắt điều khoản sở hữu trí tuệ",
          ]}
          buttonText="Nâng cấp"
          onButtonClick={handleUpgrade}
        />
      </div>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  onButtonClick: () => void;
}

function PricingCard({
  title,
  description,
  price,
  features,
  period,
  buttonText,
  highlight,
  onButtonClick,
}: PricingCardProps) {
  return (
    <Card
      className={`flex flex-col ${
        highlight ? "border-primary shadow-lg" : ""
      } relative overflow-hidden transition-all duration-300`}
    >
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-5xl font-extrabold mb-6">
          {price}
          <span className="text-base font-normal text-muted-foreground">
            {period}
          </span>
        </p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li className="flex items-center gap-2" key={index}>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={highlight ? "default" : "outline"}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
