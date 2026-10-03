import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  actionText,
  actionHref,
  onActionClick,
  className = "",
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${className}`}>
      <div className="space-y-1">
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-[11px] font-extrabold uppercase tracking-wider shadow-[0_1px_0_#bdc8d1]">
            {eyebrowIcon && <Icon name={eyebrowIcon} className="w-3.5 h-3.5" />}
            <span>{eyebrow}</span>
          </div>
        )}
        <h2 className="font-headline-lg lg:font-headline-xl text-headline-lg lg:text-headline-xl text-on-surface font-extrabold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {(actionText && actionHref) && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline shrink-0 group"
        >
          <span>{actionText}</span>
          <Icon
            name="arrow_forward"
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}

      {(actionText && !actionHref && onActionClick) && (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline shrink-0 group"
        >
          <span>{actionText}</span>
          <Icon
            name="arrow_forward"
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
