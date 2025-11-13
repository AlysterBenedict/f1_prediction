import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "F1 Prediction System | AI-Powered Racing Analytics",
    template: "%s | F1 Prediction System"
  },
  description: "Advanced machine learning predictions for Formula 1 racing. Predict podium finishes, championship winners, and analyze driver performance with AI-powered insights from 8 years of F1 data.",
  keywords: ["F1", "Formula 1", "Racing", "Predictions", "Machine Learning", "AI", "Analytics", "Podium", "Championship", "Motorsport"],
  authors: [{ name: "F1 Prediction System" }],
  creator: "F1 Prediction System",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "F1 Prediction System | AI-Powered Racing Analytics",
    description: "Advanced machine learning predictions for Formula 1 racing",
    siteName: "F1 Prediction System",
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Prediction System",
    description: "AI-Powered F1 Racing Analytics and Predictions",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
        suppressHydrationWarning
      >
        <div className="relative">
          {/* Global Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
            {/* Racing Stripes Overlay */}
            <div className="absolute inset-0 racing-stripes opacity-30"></div>
          </div>

          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>

          {/* Performance Optimizations */}
          <div className="hidden">
            {/* Preload critical images */}
            <link 
              rel="preload" 
              as="image" 
              href="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&h=600&fit=crop" 
            />
          </div>
        </div>
      </body>
    </html>
  );
}