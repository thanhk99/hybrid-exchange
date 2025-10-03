import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/shared/Footer";
import { Providers } from "./provider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { NotificationProvider } from "./components/shared/Notification";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VixEx",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body>
        <Providers>
          <NotificationProvider>
            <ProtectedRoute>
              <Header/>
              <main>{children}</main>
              <Footer/>
            </ProtectedRoute>
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}