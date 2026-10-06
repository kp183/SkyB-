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
        const ogImage = product.image_url || "/og-image.jpg";
        return {
          title: `${product.name} (Ages ${product.age_group || "Kids"})`,
          description:
            product.description ||
            `Buy ${product.name} on SkyB. Safety specs detailed with real-time AI Bargain Assistant.`,
          alternates: {
            canonical: `/product/${id}`,
          },
          openGraph: {
            title: `${product.name} | SkyB Kids Store`,
            description:
              product.description ||
              `Buy ${product.name} on SkyB with safety specs and developmental sizing.`,
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: product.name,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title: `${product.name} | SkyB Kids Store`,
            description:
              product.description ||
              `Buy ${product.name} on SkyB with safety certification and developmental sizing.`,
            images: [ogImage],
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
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title: "Product Details | SkyB",
      description: "View child-safe products with AI Bargain Assistant on SkyB.",
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.jpg"],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
