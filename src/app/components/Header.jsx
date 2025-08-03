"use client";

import Link from "next/link";
import {
  SignInButton,
  UserButton,
  SignUpButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { IoShareSocialOutline } from "react-icons/io5";

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (isLoaded && isSignedIn && !user) {
    signOut();
    return null;
  }

  return (
    <header className="border-r border-[#2e3235] flex flex-col items-center w-[23%] min-h-screen p-5  text-white">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold mb-8 tracking-tight">
        <IoShareSocialOutline className="text-5xl text-white group-hover:text-gray-300 transition duration-200" />
      </Link>

      {/* Auth Panel */}
      {isLoaded && isSignedIn && user ? (
        <div className="w-full border-1  border-[#2e3235]   rounded-lg p-4 flex flex-col items-center shadow-lg">
          <UserButton
            appearance={{
              variables: {
                colorPrimary: "#ffffff", // optional, just an example
                colorText: "#fff",
              },
              elements: {
                avatarBox: {
                  width: "50px",
                  height: "50px",
                },
              },
            }}
          />{" "}
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
        <div className="w-full">
          <SignInButton mode="modal">
            <button className="  text-white border border-[#2e3235] mb-3 cursor-pointer  font-medium py-2 px-4 rounded w-full">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-gray-200 hover:bg-white text-black cursor-pointer  font-medium py-2 px-4 rounded w-full">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      )}

      {/* Nav Links */}
    </header>
  );
}
