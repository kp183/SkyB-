import React from "react";
import Icon from "@/components/Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "add" | "bargain" | "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  iconName?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  iconName,
  iconPosition = "left",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const variantClass = {
    add: "btn-add-action",
    bargain: "btn-bargain-action",
    primary: "btn-primary-action",
    secondary: "bg-secondary-fixed text-on-secondary-fixed shadow-[0_3px_0_#ffb2b9] active:translate-y-0.5",
    outline: "bg-surface-container-lowest border-2 border-primary text-primary shadow-[0_3px_0_#bdc8d1] active:translate-y-0.5",
    ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface active:scale-95",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1.5 text-[12px] font-label-sm rounded-full gap-1",
    md: "px-4 py-2.5 text-label-md font-label-md rounded-full gap-2",
    lg: "px-6 py-3.5 text-label-lg font-label-lg rounded-full gap-2.5",
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-bold tracking-tight cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {iconName && iconPosition === "left" && (
            <Icon name={iconName} className="w-4 h-4 shrink-0" />
          )}
          {children}
          {iconName && iconPosition === "right" && (
            <Icon name={iconName} className="w-4 h-4 shrink-0" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
