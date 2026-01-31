import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/features/auth/hooks/useAuth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SkillBridge - Find Your Perfect Tutor",
  description: "Connect with expert tutors for personalized learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== 'undefined') {
    console.log('✅ App Version: v2.0 (Force Fix Active) - ' + new Date().toISOString());
  }
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
