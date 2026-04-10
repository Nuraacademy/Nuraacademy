"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { NuraButton } from "@/components/ui/button/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const isSessionError = useMemo(
    () =>
      error.message.includes("Unauthorized") ||
      error.message.includes("logged in"),
    [error.message],
  );

  useEffect(() => {
    console.error(error);
    if (isSessionError) {
      router.push("/login?message=Session expired. Please login again.");
    }
  }, [error, router, isSessionError]);

  return (
    <div className="w-full bg-[#F9F9EE] py-16 md:py-24 px-4">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
          <div className="relative bg-white p-8 rounded-xl shadow-xl border border-emerald-50 text-[#075546]">
            <CircleAlert size={64} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl font-medium text-gray-900 mb-4">
          {isSessionError ? "Sesi berakhir" : "Terjadi kesalahan"}
        </h2>
        <p className="text-gray-600 max-w-md mb-10 leading-relaxed">
          {isSessionError
            ? "Sesi Anda telah berakhir. Anda akan diarahkan ke halaman masuk."
            : "Terjadi kesalahan tak terduga. Silakan coba lagi atau kembali ke beranda."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <NuraButton
            label="Coba lagi"
            variant="primary"
            className="min-w-[200px] !rounded-full py-3 shadow-lg shadow-emerald-900/10"
            onClick={() => reset()}
          />
          <NuraButton
            label="Kembali ke beranda"
            variant="secondary"
            className="min-w-[200px] !rounded-full py-3"
            href="/"
          />
        </div>
      </div>
    </div>
  );
}
