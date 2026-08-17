import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AttendanceProvider } from "@/lib/attendance-store";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "University Attendance Infrastructure | Univ. of Hyderabad",
  description:
    "Next-generation digital classroom attendance infrastructure for University of Hyderabad faculty and students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-on-background antialiased selection:bg-tertiary-fixed selection:text-tertiary-on-fixed">
        <AuthProvider>
          <AttendanceProvider>{children}</AttendanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
