import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chúc mừng ngày Phụ nữ Việt Nam 20/10",
  description:
    "Một tấm thiệp nhỏ gửi tặng các chị em đồng nghiệp nhân ngày Phụ nữ Việt Nam 20/10 — Blooming Elegance.",
};

export const viewport: Viewport = {
  themeColor: "#FFF9F3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable} ${script.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
