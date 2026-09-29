import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/products/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      const product = json?.data;
      if (product) {
        return {
          title: `${product.name} (Ages ${product.age_group || "Kids"})`,
          description:
            product.description ||
            `Buy ${product.name} on SkyB. Child safety certified with real-time AI Bargain Assistant.`,
          openGraph: {
            title: `${product.name} | SkyB Kids Store`,
            description:
              product.description ||
              `Buy ${product.name} on SkyB with safety certification and developmental sizing.`,
            images: product.image_url ? [{ url: product.image_url }] : [],
          },
        };
      }
    }
  } catch {
    // Fallback if backend is not reachable at build time
  }

  return {
    title: "Product Details",
    description: "View child-safe products with AI Bargain Assistant on SkyB.",
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
