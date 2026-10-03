import React from "react";
import Icon from "@/components/Icon";

interface SafetyBadgesProps {
  score?: "Good" | "Medium" | "Low" | string | null;
  summary?: string | null;
  tags?: string[] | null;
  compact?: boolean;
  className?: string;
}

export const SafetyBadges: React.FC<SafetyBadgesProps> = ({
  score = "Good",
  summary,
  tags = [],
  compact = false,
  className = "",
}) => {
  const getBadgeStyle = () => {
    switch (score) {
      case "Low":
        return {
          cardBg: "bg-surface-container-high border-secondary-container text-on-surface",
          badgeBg: "bg-secondary text-on-secondary shadow-[0_2px_0_#730425]",
          icon: "warning",
          label: "Parental Supervision Advised",
        };
      case "Medium":
        return {
          cardBg: "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary shadow-[0_4px_0_#ffdf9f]",
          badgeBg: "bg-tertiary-container text-on-tertiary shadow-[0_2px_0_#795900]",
          icon: "info",
          label: "Age Appropriate Guidance",
        };
      default:
        return {
          cardBg: "bg-surface-container-lowest border-primary-container text-on-surface shadow-[0_4px_0_#c4e7ff]",
          badgeBg: "bg-primary-container text-on-primary-container shadow-[0_2px_0_#004965]",
          icon: "verified",
          label: "Safety Information On File",
        };
    }
  };

  const style = getBadgeStyle();

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-[11px] font-bold ${style.badgeBg} ${className}`}
      >
        <Icon name="verified" className="w-3.5 h-3.5" />
        <span>{style.label}</span>
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${style.cardBg} ${className}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${style.badgeBg}`}
        >
          <Icon name="verified" className="w-4 h-4" />
          <span>Safety Profile</span>
        </span>
        <span className="font-headline-md text-headline-md font-bold text-on-surface">
          {style.label}
        </span>
      </div>
      {summary && (
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {summary}
        </p>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full bg-surface-container px-2.5 py-0.5 font-label-sm text-label-sm font-bold text-on-surface shadow-[0_1px_0_#bdc8d1]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyBadges;
