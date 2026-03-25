import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full">
      <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
      <p className="text-sm text-neutral-500 font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}
