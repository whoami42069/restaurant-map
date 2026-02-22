import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Restaurant Map | World's Best Restaurants",
  description: "Interactive map of the World's 50 Best Restaurants and La Liste Top 100. Explore, compare, and discover the finest dining destinations worldwide.",
  keywords: ["restaurants", "fine dining", "world's best restaurants", "la liste", "michelin", "food map"],
  openGraph: {
    title: "Restaurant Map | World's Best Restaurants",
    description: "Interactive map of the World's 50 Best Restaurants and La Liste Top 100",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
