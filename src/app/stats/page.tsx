"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import PageSpinner from "@/components/PageSpinner";
import { type InteractionType, useRelationshipData } from "@/lib/relationship-store";
import { usePageSpinner } from "@/lib/use-page-spinner";

const interactionTypes: InteractionType[] = ["Message", "Call", "Video"];
const colors = ["#22574A", "#4C8B74", "#D5A14F"];

type CustomLegendProps = {
  payload?: ReadonlyArray<{
    color?: string;
    value?: string | number;
  }>;
};

const renderLegend = ({ payload = [] }: CustomLegendProps) => {
  return (
    <ul className="mt-4 flex justify-center gap-6">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const StatsPage = () => {
  const { data, isLoading } = useRelationshipData();
  const isPageSpinnerActive = usePageSpinner();

  if (isLoading || isPageSpinnerActive) {
    return <PageSpinner label="Loading your stats..." />;
  }

  const chartData = interactionTypes.map((type) => ({
    name: type,
    value: data?.timeline.filter((item) => item.type === type).length ?? 0,
  }));

  return (
    <div className="container mx-auto mt-12 mb-24 max-w-5xl px-4">
      <h1 className="mb-10 text-center text-4xl font-bold tracking-tight text-[#1C2024] md:text-[44px]">Friendship Analytics</h1>

      <div className="flex min-h-[400px] flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-md md:p-10">
        <h2 className="mb-8 font-medium text-[#1C2024]">By Interaction Type</h2>
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="h-[300px] w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  cornerRadius={6}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Legend content={renderLegend} verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
