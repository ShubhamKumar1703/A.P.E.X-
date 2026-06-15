import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className = "", count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-zinc-800/50 rounded-lg animate-pulse ${className}`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: "1.5s",
          }}
        />
      ))}
    </>
  );
}
