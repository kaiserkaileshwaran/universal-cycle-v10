"use client";

import { useCallback, useState } from "react";
import LoadingExperience from "@/components/loading-experience";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => setIsLoaded(true), []);

  return (
    <>
      <LoadingExperience onComplete={handleLoadComplete} />
      <div className={isLoaded ? "contents" : "hidden"}>{children}</div>
    </>
  );
}
