import type { Metadata } from "next";
import { NotFoundState } from "@/components/ui/status/not_found_state";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan | Nura Academy",
};

export default function NotFound() {
  return (
    <div className="w-full bg-[#F9F9EE] py-16 md:py-24">
      <NotFoundState
        title="Halaman tidak ditemukan"
        message="Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Periksa alamat URL atau kembali ke beranda."
        buttonLabel="Kembali ke beranda"
        href="/"
      />
    </div>
  );
}
