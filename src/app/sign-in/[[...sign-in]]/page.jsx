import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center  px-4 py-8">
      <div className="w-full max-w-md rounded-lg shadow-lg p-6 text-white">
        <SignIn />
      </div>
    </div>
  );
}
