import type { Metadata } from "next";
import { Inter, Noto_Sans_Telugu, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AttendanceProvider } from "@/lib/attendance-store";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-telugu",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "University Attendance Infrastructure | Univ. of Hyderabad",
  description:
    "Next-generation digital classroom attendance infrastructure for University of Hyderabad faculty and students.",
  icons: {
    icon: "/uohyd-logo.png",
    apple: "/uohyd-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoTelugu.variable} ${notoDevanagari.variable}`}
    >
      <body className="bg-background text-on-background antialiased selection:bg-tertiary-fixed selection:text-tertiary-on-fixed">
        <AuthProvider>
          <AttendanceProvider>{children}</AttendanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
