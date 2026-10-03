interface SafetyBadgeProps {
  score?: "Good" | "Medium" | "Low" | null;
  summary?: string | null;
  tags?: string[] | null;
  compact?: boolean;
}

export default function SafetyBadge({
  score = "Good",
  summary,
  tags = [],
  compact = false,
}: SafetyBadgeProps) {
  const getBadgeStyle = () => {
    switch (score) {
      case "Low":
        return {
          cardBg: "bg-surface-container-high border-secondary-container text-on-surface",
          badgeBg: "bg-secondary text-on-secondary shadow-[0_2px_0_#730425]",
          icon: "warning",
          label: "Parental Caution Advised",
        };
      case "Medium":
        return {
          cardBg: "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary shadow-[0_4px_0_#f9bd22]",
          badgeBg: "bg-tertiary-container text-on-tertiary shadow-[0_2px_0_#795900]",
          icon: "info",
          label: "Mild Caution / Supervision",
        };
      default:
        return {
          cardBg: "bg-surface-container-lowest border-primary-container text-on-surface shadow-[0_6px_0_#c4e7ff]",
          badgeBg: "bg-primary-container text-on-primary-container shadow-[0_2px_0_#00668a]",
          icon: "verified_user",
          label: "100% Non-Toxic Child Safe",
        };
    }
  };

  const style = getBadgeStyle();

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${style.badgeBg}`}
      >
        <span className="material-symbols-outlined text-[14px]">{style.icon}</span>
        {style.label}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${style.cardBg}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-bold ${style.badgeBg}`}
        >
          <span className="material-symbols-outlined text-[16px]">{style.icon}</span>
          {score || "Verified"} Safety
        </span>
        <span className="font-headline-md text-headline-md font-bold">{style.label}</span>
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
              🌱 {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
