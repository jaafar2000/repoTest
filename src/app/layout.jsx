import { Inter } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Header from "./components/Header";
import Loader from "./components/Loader";
import SessionValidator from "./components/SessionValidator";
import RightSidebar from "./components/RightSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next auth",
  description: "Next auth with clerk and mongodb",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className} h-full bg-black text-white`}>
          <div className="flex flex-col md:flex-row w-full md:w-[70%] mx-auto h-full min-h-screen">
            <ClerkLoading>
              <Loader />
            </ClerkLoading>
            <ClerkLoaded>
              <SessionValidator />
              <Header />
              {children}
              <RightSidebar />
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
