import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface SafetyBadgeProps {
  score?: "Good" | "Medium" | "Low" | null;
  summary?: string | null;
  tags?: string[] | null;
  compact?: boolean;
}

export default function SafetyBadge({ score = "Good", summary, tags = [], compact = false }: SafetyBadgeProps) {
  const getBadgeStyle = () => {
    switch (score) {
      case "Low":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          badge: "bg-rose-700 text-white",
          icon: <ShieldAlert className="h-3.5 w-3.5" />,
          label: "Caution Advised",
        };
      case "Medium":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          badge: "bg-amber-700 text-white",
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
          label: "Parental Guidance",
        };
      default:
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          badge: "bg-emerald-700 text-white",
          icon: <ShieldCheck className="h-3.5 w-3.5" />,
          label: "Child Safe Verified",
        };
    }
  };

  const style = getBadgeStyle();

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${style.bg}`}>
        {style.icon}
        {style.label}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-3 ${style.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${style.badge}`}>
          {style.icon} {score || "Verified"} Safety
        </span>
        <span className="text-xs font-semibold">{style.label}</span>
      </div>
      {summary && <p className="text-xs leading-relaxed opacity-90">{summary}</p>}
      {tags && tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <span key={idx} className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium border border-current/10">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
