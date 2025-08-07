"use client";

import Link from "next/link";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { IoShareSocialOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Menu, X, UsersRound, House } from "lucide-react";
import { usePostsStore } from "@/lib/actions/useStateStore";

import Loader from "./Loader";

export default function Header() {
  const postsNo = usePostsStore((state) => state.posts);

  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (isLoaded && isSignedIn && !user) {
      signOut();
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/currentuser?currentUserId=${user.id}`);
        if (!res.ok) {
          console.error("Failed fetching current user");
          return;
        }
        const data = await res.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
    setLoading(false);
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (currentUser && postsNo.length > 0) {
      const filtered = postsNo.filter(
        (x) => x.userMongoId?._id === currentUser._id
      );

      console.log("✅ Filtered posts for current user:", filtered);

      setUserPosts(filtered);
    }
  }, [currentUser, postsNo]);
  return (
    <>
      <>
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <div className="md:hidden flex items-center justify-between p-4 border-b bg-[#121212] border-[#2e3235] text-white z-50 relative">
          <Link href="/" className="text-2xl font-bold">
            <IoShareSocialOutline className="text-3xl" />
          </Link>
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>


        <aside
          className={`
          fixed top-0 left-0 h-full text-white z-50 border-r border-[#2e3235]
          transform transition-transform duration-300 ease-in-out
          w-[80%] max-w-[280px] md:w-[300px]
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex md:flex-col
          p-4 bg-[#121212] lg:bg-[#0a0a0a]
        `}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <Link
                  href="/"
                  className="font-bold flex items-center w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoShareSocialOutline className="text-4xl" />
                </Link>
                <button
                  className="md:hidden"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {isLoaded && isSignedIn && user ? (
                <div>
                  <div className="w-full border border-[#2e3235] rounded-xl p-5 flex flex-col items-center shadow mb-6 ">
                    <UserButton
                      appearance={{
                        variables: {
                          colorPrimary: "#ffffff",
                          colorText: "#fff",
                        },
                        elements: {
                          avatarBox: {
                            width: "60px",
                            height: "60px",
                          },
                        },
                      }}
                    />
                    <div className="mt-4 text-center text-sm space-y-1">
                      <p className="font-semibold text-lg">
                        {currentUser?.firstName || "Unknown"}{" "}
                        {currentUser?.lastName || ""}
                      </p>
                      {currentUser?.username && (
                        <p className="text-gray-400">@{currentUser.username}</p>
                      )}
                      <p className="text-gray-400 text-xs">
                        {currentUser?.email || "No email"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Joined:{" "}
                        {currentUser?.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <div className="flex gap-4 justify-center pt-2 text-xs text-gray-400">
                        <span>
                          Followers: {currentUser?.followers?.length || 0}
                        </span>
                        <span>
                          Following: {currentUser?.following?.length || 0}
                        </span>
                        <span>Posts: {userPosts?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="mb-3 w-full flex items-center justify-center gap-2 bg-white text-black text-lg font-medium rounded-xl px-6 py-2 transition hover:bg-gray-200"
                  >
                    <House className="w-5 h-5" />
                    Home
                  </Link>

                  <Link
                    href="/users"
                    className="w-full flex items-center justify-center gap-2 bg-white text-black text-lg font-medium rounded-xl px-6 py-2 transition hover:bg-gray-200"
                  >
                    <UsersRound className="w-5 h-5" />
                    Users
                  </Link>
                </div>
              ) : (
                <div className="w-full space-y-3 mb-4">
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                    <button className="text-white border border-[#2e3235] w-full py-2 rounded hover:bg-[#1a1a1a]">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                    <button className="bg-gray-200 text-black w-full py-2 rounded hover:bg-gray-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </aside>
      </>
    </>
  );
}
