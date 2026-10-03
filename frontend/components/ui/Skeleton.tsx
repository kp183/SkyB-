import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "card" | "text" | "rectangular" | "circle";
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  count = 1,
}) => {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-surface-container-lowest p-4 border border-surface-container shadow-[0_6px_0_#c4e7ff] flex flex-col justify-between h-[390px] animate-pulse"
          >
            <div className="w-full aspect-square rounded-lg bg-surface-container-low" />
            <div className="space-y-2 pt-3">
              <div className="h-4 bg-surface-container rounded-full w-1/3" />
              <div className="h-5 bg-surface-container-high rounded-full w-5/6" />
              <div className="h-3 bg-surface-container rounded-full w-1/2" />
            </div>
            <div className="pt-3 flex items-center justify-between">
              <div className="h-6 bg-surface-container-high rounded-full w-20" />
              <div className="h-8 bg-surface-container rounded-full w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-surface-container ${
            variant === "circle"
              ? "rounded-full"
              : variant === "text"
              ? "rounded-full h-4 my-1"
              : "rounded-lg"
          } ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
