import Icon from "@/components/Icon";

export default function PerksBar() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Perk 1 */}
      <div className="flex items-start gap-4 p-5 rounded-lg bg-surface-container-lowest shadow-[0_6px_0_#c4e7ff] hover:translate-y-[-2px] transition-transform">
        <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0 shadow-[0_3px_0_#7bd0ff]">
          <Icon name="shield" className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface">Safety Details</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Detailed materials and age guides on every item.</p>
        </div>
      </div>

      {/* Perk 2 */}
      <div className="flex items-start gap-4 p-5 rounded-lg bg-surface-container-lowest shadow-[0_6px_0_#ffdadc] hover:translate-y-[-2px] transition-transform">
        <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center shrink-0 shadow-[0_3px_0_#fe7488]">
          <Icon name="smart_toy" className="w-6 h-6 text-secondary" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface">SkyBot Negotiator</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Interactive parent haggling with real server price drops.</p>
        </div>
      </div>

      {/* Perk 3 */}
      <div className="flex items-start gap-4 p-5 rounded-lg bg-surface-container-lowest shadow-[0_6px_0_#ffdf9f] hover:translate-y-[-2px] transition-transform">
        <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center shrink-0 shadow-[0_3px_0_#f9bd22]">
          <Icon name="redeem" className="w-6 h-6 text-tertiary" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface">Delivery Support</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Free delivery on eligible demo orders (See Terms).</p>
        </div>
      </div>

      {/* Perk 4 */}
      <div className="flex items-start gap-4 p-5 rounded-lg bg-surface-container-lowest shadow-[0_6px_0_#d5e3fc] hover:translate-y-[-2px] transition-transform">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center shrink-0 shadow-[0_3px_0_#bdc8d1]">
          <Icon name="sync_alt" className="w-6 h-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-md text-headline-md text-on-surface">Easy Returns</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Return requests supported for demo orders (See Terms).</p>
        </div>
      </div>
    </section>
  );
}
