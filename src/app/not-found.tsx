"use client";

import Link from "next/link";
import PageSpinner from "@/components/PageSpinner";
import { usePageSpinner } from "@/lib/use-page-spinner";

export default function NotFound() {
  const isPageSpinnerActive = usePageSpinner();

  if (isPageSpinnerActive) {
    return <PageSpinner label="Loading page..." />;
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6">
        <p className="text-[88px] font-black uppercase leading-none tracking-[-0.08em] text-[#22574A] md:text-[132px]">404</p>
      </div>

      <h1 className="mb-4 text-xl tracking-tight text-gray-700 md:text-5xl">This page does not exist</h1>
      <p className="mx-auto mb-8 max-w-xl text-base text-gray-500 md:text-lg">The route you requested could not be found. Try one of the main pages below to get back on track.</p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className="rounded-lg bg-[#22574A] px-5 py-3 font-medium text-white transition-colors hover:bg-[#1A453A]">
          Go Home
        </Link>
      </div>
    </div>
  );
}
