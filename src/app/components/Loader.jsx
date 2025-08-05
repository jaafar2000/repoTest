export default function Loader() {
  return (
    <div className="absolute left-1/2 bg-black w-full z-100 opacity-35 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full border-t-4 border-red-500 border-solid h-10 w-10"></div>
      </div>
    </div>
  );
}
