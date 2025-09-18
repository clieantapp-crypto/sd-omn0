import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " سوار الدفع الذكي",
  description: "جرب أسهل طريقة للدفع من معصمك مع بنك مسقط",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
