import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://revstore.revrica.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Revrica | Laptops for Teachers, From ₦15,000/Month",
    template: "%s | Revrica"
  },
  description:
    "Revrica's Teacher Empowerment Program puts a Rev laptop in the hands of every Nigerian teacher and school. Apply now, pay monthly from ₦15,000, spread over up to 24 months.",
  keywords: [
    "Revrica",
    "buy now pay later laptop Nigeria",
    "laptop for teachers Nigeria",
    "Teacher Empowerment Program",
    "BNPL devices for teachers",
    "laptop financing Nigeria",
    "school laptop payment plan",
    "affordable laptops for teachers"
  ],
openGraph: {
  title: "Revrica | A Laptop for Every Teacher",
  description: "Apply for the Teacher Digital Empowerment Program. From ₦15,000/month. Monthly installments spread over 12, 24 or 36 months.",
  type: "website",
  siteName: "Revrica",
  url: siteUrl,
  images: [
    {
      url: `${siteUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Revrica - A Laptop for Every Teacher"
    }
  ]
},
twitter: {
  card: "summary_large_image",
  title: "Revrica | A Laptop for Every Teacher",
  description: "From ₦15,000/month, spread over up to 24 months. Apply for the Teacher Digital Empowerment Program today.",
  images: [`${siteUrl}/og-image.png`]
},
  alternates: {
    canonical: siteUrl
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
