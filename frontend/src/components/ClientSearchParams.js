"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InnerComponent({ onParams }) {
  const searchParams = useSearchParams();
  onParams(searchParams);
  return null;
}

export default function ClientSearchParams({ onParams }) {
  return (
    <Suspense fallback={null}>
      <InnerComponent onParams={onParams} />
    </Suspense>
  );
}
