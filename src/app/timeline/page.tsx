"use client";

import Image from "next/image";
import { useState } from "react";
import PageSpinner from "@/components/PageSpinner";
import { type InteractionType, useRelationshipData } from "@/lib/relationship-store";
import { usePageSpinner } from "@/lib/use-page-spinner";

const interactionTypes: InteractionType[] = ["Call", "Message", "Video"];
const filterOptions = ["All", ...interactionTypes] as const;

type TimelineFilter = (typeof filterOptions)[number];

const TimelinePage = () => {
  const { data, isLoading } = useRelationshipData();
  const isPageSpinnerActive = usePageSpinner();
  const [filter, setFilter] = useState<TimelineFilter>("All");
  const timelineData = data?.timeline ?? [];

  if (isLoading || isPageSpinnerActive) {
    return <PageSpinner label="Loading your timeline..." />;
  }

  const filteredData =
    filter === "All" ? timelineData : timelineData.filter((item) => item.type === filter);

  return (
    <div className="container mx-auto mt-12 mb-20 max-w-4xl px-4">
      <h1 className="mb-8 text-4xl font-bold text-[#1C2024]">Timeline</h1>

      <div className="mb-6">
        <select className="select select-bordered w-[200px] border-gray-200 bg-white text-gray-500 shadow-sm focus:border-[#22574A] focus:outline-none" value={filter} onChange={(event) => setFilter(event.target.value as TimelineFilter)}>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "Filter timeline" : option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md md:px-6 md:py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50/50">
                <Image src={item.icon} alt={item.type} width={40} height={40} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <p className="text-[15px] text-[#1C2024]">
                  <span className="font-bold">{item.type}</span>{" "}
                  <span className="text-gray-500">with {item.with}</span>
                </p>
                <p className="mt-0.5 text-sm text-gray-400">{item.date}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">No timeline interactions found.</div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
