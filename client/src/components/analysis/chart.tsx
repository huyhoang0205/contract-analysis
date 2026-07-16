"use client";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
      label: "giá trị",
    },
    Risks: {
      label: "Rủi ro",
      color: "var(--chart-3)",
    },
    Opportunities: {
      label: "Cơ hội",
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
                      <tspan>Điểm đánh giá</tspan>
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
