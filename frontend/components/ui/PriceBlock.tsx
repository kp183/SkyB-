import React from "react";

interface PriceBlockProps {
  price: number;
  mrp?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceBlock: React.FC<PriceBlockProps> = ({
  price,
  mrp,
  size = "md",
  className = "",
}) => {
  const formattedPrice = `₹${Math.round(price).toLocaleString("en-IN")}`;
  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  const sizeClasses = {
    sm: {
      price: "font-headline-sm text-[16px] font-bold text-on-surface",
      mrp: "font-body-sm text-[12px] text-outline line-through",
      badge: "font-label-sm text-[10px] px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold",
    },
    md: {
      price: "font-headline-sm text-headline-sm font-bold text-on-surface",
      mrp: "font-body-sm text-body-sm text-outline line-through",
      badge: "font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold",
    },
    lg: {
      price: "font-headline-lg text-headline-lg font-bold text-on-surface",
      mrp: "font-body-md text-body-md text-outline line-through",
      badge: "font-label-md text-label-md px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold",
    },
  }[size];

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={sizeClasses.price}>{formattedPrice}</span>
      {hasDiscount && (
        <>
          <span className={sizeClasses.mrp}>
            ₹{Math.round(mrp).toLocaleString("en-IN")}
          </span>
          {discountPercent > 0 && (
            <span className={sizeClasses.badge}>
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceBlock;
