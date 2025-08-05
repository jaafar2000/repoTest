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
              <div className="hidden md:block w-full md:w-[30%] lg:w-[30%] px-4 py-6 text-white space-y-6 border-t md:border-l md:border-t-0 border-[#2e3235] overflow-y-auto max-h-[100vh]">
                <RightSidebar />
              </div>
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
