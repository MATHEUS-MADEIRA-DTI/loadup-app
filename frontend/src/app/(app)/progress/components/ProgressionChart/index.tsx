"use client";

import { useMemo } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { ExerciseChart } from "@/types";

import { StyledEmpty, StyledWrapper } from "./styles";

interface ProgressionChartProps {
  data: ExerciseChart;
  primaryColor: string;
  primaryContainerColor: string;
  onSurfaceMuted: string;
  surfaceColor: string;
  onSurfaceColor: string;
  outlineVariant: string;
}

function formatXDate(dateStr: string): string {
  return dateStr.substring(5, 10).replace("-", "/");
}

export default function ProgressionChart({
  data,
  primaryColor,
  primaryContainerColor,
  onSurfaceMuted,
  surfaceColor,
  onSurfaceColor,
  outlineVariant,
}: ProgressionChartProps) {
  const chartData = useMemo(
    () =>
      data.chartData.map((point) => ({
        ...point,
        dateLabel: formatXDate(point.date),
      })),
    [data.chartData],
  );

  if (chartData.length === 0) {
    return (
      <StyledEmpty style={{ color: onSurfaceMuted }}>
        Sem dados para exibir.
      </StyledEmpty>
    );
  }

  return (
    <StyledWrapper>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10, fill: onSurfaceMuted }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="weight"
            orientation="left"
            tick={{ fontSize: 10, fill: onSurfaceMuted }}
            tickLine={false}
            axisLine={false}
            unit=""
            width={44}
          />
          <YAxis
            yAxisId="reps"
            orientation="right"
            tick={{ fontSize: 10, fill: onSurfaceMuted }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              fontSize: "12px",
              border: `1px solid ${outlineVariant}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
              backgroundColor: surfaceColor,
              color: onSurfaceColor,
            }}
            formatter={(value: number, name: string) =>
              name === "weight" ? [`${value} kg`, "Peso"] : [value, "Reps"]
            }
          />
          <Bar
            yAxisId="reps"
            dataKey="reps"
            fill={primaryContainerColor}
            radius={[3, 3, 0, 0]}
            maxBarSize={18}
          />
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="weight"
            stroke={primaryColor}
            strokeWidth={2}
            dot={{ fill: primaryColor, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledWrapper>
  );
}
