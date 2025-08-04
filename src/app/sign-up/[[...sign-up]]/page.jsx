import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex  w-[50%] border-r max-h-screen overflow-scroll border-[#2e3235] items-center justify-center p-3"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <SignUp />
    </div>
  );
}
