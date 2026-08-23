import "./globals.css";

export const metadata = {
  title: "LUXORA — Luxury Fashion",
  description: "Discover timeless fashion with LUXORA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}