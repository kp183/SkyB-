import React from "react";
import Icon from "@/components/Icon";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  iconName?: string;
  count?: number;
  onClear?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  iconName,
  count,
  onClear,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer select-none active:translate-y-0.5 ${
        selected
          ? "bg-primary text-on-primary shadow-[0_3px_0_#004965]"
          : "bg-surface-container-low text-on-surface hover:bg-surface-container shadow-[0_2px_0_#bdc8d1]"
      } ${className}`}
    >
      {iconName && <Icon name={iconName} className="w-4 h-4 shrink-0" />}
      <span>{label}</span>
      {typeof count === "number" && (
        <span
          className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
            selected
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          {count}
        </span>
      )}
      {selected && onClear && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="ml-1 hover:opacity-80 p-0.5 rounded-full cursor-pointer"
        >
          <Icon name="close" className="w-3.5 h-3.5" />
        </span>
      )}
    </button>
  );
};

export default Chip;
