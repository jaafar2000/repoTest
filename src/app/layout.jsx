import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Header from "./components/Header";
import Loader from "./components/Loader";
import SessionValidator from "./components/SessionValidator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next auth",
  description: "Next auth with clerk and mongodb",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>
            <SessionValidator/>
            <Header />
            {children}
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
