"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { IoShareSocialOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoaded && isSignedIn && !user) {
    signOut();
    return null;
  }

  return (
    <>
      {/* 🔹 Mobile Top Bar */}
      <div className="md:hidden flex items-center z-[100] justify-between bg-[#1a1a1a] p-4 border-b border-[#2e3235] text-white ">
        <Link href="/" className="text-2xl font-bold">
          <IoShareSocialOutline className="text-3xl" />
        </Link>
        <button onClick={() => setMenuOpen(prev=>!prev)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 🔹 Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#1a1a1a] text-white z-50 border-r border-[#2e3235] p-5
          transform transition-transform duration-300 ease-in-out
          w-[80%] max-w-[280px]
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-[240px] md:flex md:flex-col
        `}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between w-full mb-6 md:mb-8">
          <Link
            href="/"
            className="text-2xl font-bold flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            <IoShareSocialOutline className="text-3xl" />
          </Link>
          {/* Close button for mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 🔹 Auth Panel */}
        {isLoaded && isSignedIn && user ? (
          <div className="w-full border border-[#2e3235] rounded-lg p-4 flex flex-col items-center shadow mb-4">
            <UserButton
              appearance={{
                variables: {
                  colorPrimary: "#ffffff",
                  colorText: "#fff",
                },
                elements: {
                  avatarBox: {
                    width: "50px",
                    height: "50px",
                  },
                },
              }}
            />
            <div className="mt-3 text-center text-sm">
              <p className="font-semibold text-lg">
                {user.firstName || "Unknown"} {user.lastName || ""}
              </p>
              {user.username && (
                <p className="text-gray-400 mb-1">@{user.username}</p>
              )}
              <p className="text-gray-400 mb-1">
                {user.primaryEmailAddress?.emailAddress || "No email"}
              </p>
              <p className="text-gray-500 text-xs">
                Joined:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full mb-4">
            <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
              <button className="text-white border border-[#2e3235] mb-3 w-full py-2 rounded">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
              <button className="bg-gray-200 text-black w-full py-2 rounded">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </aside>

      {/* 🔹 Backdrop when menu is open (mobile only) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
