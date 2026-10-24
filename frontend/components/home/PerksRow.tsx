"use client";

import React from "react";
import Icon from "@/components/Icon";

interface PerksRowProps {
  isFixture?: boolean;
}

export const PerksRow: React.FC<PerksRowProps> = ({ isFixture = false }) => {
  const shippingText = isFixture ? "Free above ₹499 orders" : "Free on all demo orders";
  const returnsText = isFixture ? "7-day doorstep pickup" : "7-day demo workflow test";

  return (
    <section data-section="perks" className="w-full px-4 lg:px-margin-desktop py-8 border-t border-surface-container-high/40">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Perk 1: Baby-Safe */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#d8e3fb] card-shadow-blue">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <Icon name="verified_user" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">100% Baby-Safe</h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant">Safety info on every product</p>
          </div>
        </div>

        {/* Perk 2: Delivery */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#d8e3fb] card-shadow-pink">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
            <Icon name="local_shipping" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Pan-India Delivery</h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant">{shippingText}</p>
          </div>
        </div>

        {/* Perk 3: Returns */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#d8e3fb] card-shadow-yellow">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
            <Icon name="sync_alt" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Hassle-Free Returns</h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant">{returnsText}</p>
          </div>
        </div>

        {/* Perk 4: SkyBot Pricing */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-[0_3px_0_#d8e3fb] card-shadow-blue">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <Icon name="smart_toy" className="text-[22px]" />
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">SkyBot AI Pricing</h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant">Interactive parent savings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerksRow;
