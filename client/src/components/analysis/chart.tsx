"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface OverallScoreChartProps {
  overallScore: number;
}

export default function OverallScoreChart({
  overallScore,
}: OverallScoreChartProps) {
  const pieChartData = [
    {
      name: "Risks",
      value: 100 - overallScore,
      fill: "var(--chart-1)",
    },
    {
      name: "Opportunities",
      value: overallScore,
      fill: "var(--chart-2)",
    },
  ];

  const chartConfig = {
    value: {
      label: "value",
    },
    Risks: {
      label: "Risks",
      color: "var(--chart-3)",
    },
    Opportunities: {
      label: "Opportunities",
      color: "var(--chart-4)",
    },
  };

  return (
    <div className="w-full h-full">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-62.5"
      >
        <PieChart>
          <ChartTooltip cursor content={<ChartTooltipContent />} />
          <Pie
            data={pieChartData}
            dataKey={"value"}
            nameKey="name"
            innerRadius={"60"}
            paddingAngle={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text>
                      <tspan>{overallScore}%</tspan>
                      <tspan>Score</tspan>
                    </text>
                  );
                }
              }}
            ></Label>
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
