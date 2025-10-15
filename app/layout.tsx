import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import { Toaster } from "sonner"; 

export const metadata: Metadata = {
  title: "Remote Job Tracker",
  description: "Track your remote job applications easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
