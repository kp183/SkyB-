"use client";

import React from "react";
import Icon from "@/components/Icon";
import { useSkyBot } from "@/context/SkyBotContext";

interface SkyBotPromoTileProps {
  isFixture?: boolean;
}

export const SkyBotPromoTile: React.FC<SkyBotPromoTileProps> = ({ isFixture = false }) => {
  const { openSkyBot } = useSkyBot();

  const handleOpenBot = (e: React.MouseEvent) => {
    e.preventDefault();
    openSkyBot();
  };

  return (
    <>
      {/* Desktop Promo Tile (home_restyled_locked_candy Section 6) */}
      <section data-section="skybot-promo" className="w-full px-4 lg:px-margin-desktop py-4 hidden md:block">
        <div className="p-5 rounded-xl bg-gradient-to-r from-tertiary-fixed via-surface-container-low to-primary-fixed shadow-[0_4px_0_#d8e3fb] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-[0_3px_0_#f9bd26] shrink-0">
              <Icon name="smart_toy" className="text-[32px]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[11px] font-extrabold mb-1">
                <Icon name="auto_awesome" className="text-[14px]" />
                <span>SkyBot AI Assistant</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Bargain with SkyBot to unlock customized bundle savings
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Negotiate playful bundles, request coupon savings, or match multiple items directly in Indian Rupees.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[0_4px_0_#001e2c] active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
            onClick={handleOpenBot}
          >
            <Icon name="chat" className="text-[20px]" />
            <span>Try SkyBot Deal Chat</span>
          </button>
        </div>
      </section>

      {/* Mobile Promo Banner (home_hub_skyb_india_mobile Section 5) */}
      <section data-section="skybot-promo-mobile" className="w-full px-space-md mt-6 block md:hidden">
        <div className="rounded-2xl bg-gradient-to-r from-tertiary-fixed via-tertiary-fixed-dim/70 to-surface-container-high p-space-md shadow-[0_4px_0_#c49b14] flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-tertiary flex items-center justify-center shadow-md shrink-0">
              <Icon name="smart_toy" className="text-[28px]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] font-bold mb-0.5">
                AI Assistant
              </div>
              <h4 className="font-headline-sm text-[17px] text-on-surface font-bold leading-tight">
                Want to negotiate custom deals?
              </h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight mt-0.5">
                Bargain with SkyBot for baby bundle savings!
              </p>
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-[0_3px_0_#001e2c] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
            onClick={handleOpenBot}
          >
            <span>Chat</span>
            <Icon name="send" className="text-[15px]" />
          </button>
        </div>
      </section>
    </>
  );
};

export default SkyBotPromoTile;
