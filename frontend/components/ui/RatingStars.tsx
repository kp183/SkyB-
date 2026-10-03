import React from "react";
import Icon from "@/components/Icon";

interface RatingStarsProps {
  rating?: number | null;
  reviewCount?: number | null;
  reserveSlot?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  reserveSlot = true,
  className = "",
}) => {
  const hasRealReviews = Boolean(
    rating && rating > 0 && reviewCount && reviewCount > 0
  );

  if (!hasRealReviews) {
    if (reserveSlot) {
      // Fixed-height empty slot so cards keep identical height
      return <div className={`h-5 w-full ${className}`} aria-hidden="true" />;
    }
    return null;
  }

  const roundedRating = Number(rating).toFixed(1);

  return (
    <div className={`h-5 flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-tertiary-fixed-dim">
        <Icon name="star" className="w-4 h-4 fill-current text-tertiary-container" />
      </div>
      <span className="font-label-sm text-label-sm font-bold text-on-surface">
        {roundedRating}
      </span>
      <span className="font-body-sm text-[12px] text-outline">
        ({reviewCount})
      </span>
    </div>
  );
};

export default RatingStars;
