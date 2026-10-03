import React from "react";
import Icon from "@/components/Icon";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "neutral" | "success" | "warning";
  iconName?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  iconName,
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-primary-fixed text-on-primary-fixed shadow-[0_1px_0_#87cff8]",
    secondary: "bg-secondary-fixed text-on-secondary-fixed shadow-[0_1px_0_#ffb2b9]",
    tertiary: "bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_1px_0_#f9bd22]",
    neutral: "bg-surface-container text-on-surface shadow-[0_1px_0_#bdc8d1]",
    success: "bg-primary-container text-on-primary-container shadow-[0_1px_0_#004965]",
    warning: "bg-tertiary-container text-on-tertiary shadow-[0_1px_0_#795900]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${variantStyles} ${className}`}
    >
      {iconName && <Icon name={iconName} className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
