"use client";

import Banner from "@/components/Banner";
import Friends from "@/components/Friends";
import PageSpinner from "@/components/PageSpinner";
import { useRelationshipData } from "@/lib/relationship-store";
import { usePageSpinner } from "@/lib/use-page-spinner";

const HomeContent = () => {
  const { data, isLoading } = useRelationshipData();
  const isPageSpinnerActive = usePageSpinner();

  if (isLoading || isPageSpinnerActive) {
    return <PageSpinner label="Loading your dashboard..." />;
  }

  return (
    <>
      <Banner />
      <Friends data={data} />
    </>
  );
};

export default HomeContent;
