"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClientSearchParams({ onRedirected }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirected = searchParams.get("redirected");
    if (redirected) {
      onRedirected();
    }
  }, [searchParams, onRedirected]);

  return null;
}
