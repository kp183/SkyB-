// TODO-PHASE-N: Temporary placeholder component for routes awaiting phase implementation
import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  iconName?: string;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  todoPhase?: number;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = "package_2",
  title,
  description,
  actionText = "Back to Home",
  actionHref = "/",
  onAction,
  todoPhase,
  className = "",
}) => {
  return (
    <div
      className={`w-full max-w-xl mx-auto my-8 p-8 sm:p-12 text-center rounded-xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_6px_0_#c4e7ff] flex flex-col items-center gap-4 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-[0_3px_0_#87cff8]">
        <Icon name={iconName} className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        {todoPhase && (
          <span className="inline-block px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-extrabold shadow-[0_2px_0_#f9bd22] mb-1">
            // TODO-PHASE-{todoPhase} In Progress
          </span>
        )}
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="pt-2">
        {actionHref ? (
          <Link href={actionHref}>
            <Button variant="primary" size="md" iconName="arrow_forward" iconPosition="right">
              {actionText}
            </Button>
          </Link>
        ) : onAction ? (
          <Button
            variant="primary"
            size="md"
            iconName="arrow_forward"
            iconPosition="right"
            onClick={onAction}
          >
            {actionText}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyState;
