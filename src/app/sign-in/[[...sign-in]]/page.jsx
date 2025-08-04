import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="w-full md:w-[50%] flex items-center justify-center border-r max-h-screen overflow-scroll border-[#2e3235]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <SignIn />
    </div>
  );
}
