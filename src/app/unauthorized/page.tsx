import { ShieldAlert } from "lucide-react";
import { NuraButton } from "@/components/ui/button/button";

export default async function UnauthorizedPage({
    searchParams,
}: {
    searchParams: Promise<{ needed?: string | string[] }>;
}) {
    const params = await searchParams;
    const neededParam = Array.isArray(params.needed)
        ? params.needed[0]
        : params.needed;

    const neededPermission = neededParam
        ? decodeURIComponent(neededParam)
        : null;

    return (
        <div className="w-full bg-[#F9F9EE] py-16 md:py-24 px-4">
            <div className="flex flex-col items-center max-w-md mx-auto text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
                    <div className="relative bg-white p-8 rounded-xl shadow-xl border border-emerald-50 text-[#075546]">
                        <ShieldAlert size={64} strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-medium text-gray-900 mb-4">
                    Akses ditolak
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Anda tidak memiliki peran atau izin yang diperlukan untuk membuka
                    halaman ini atau melakukan aksi tersebut.
                </p>

                {neededPermission && (
                    <div className="w-full mt-2 mb-8 p-4 bg-amber-50/80 rounded-2xl border border-amber-100 text-left">
                        <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-2">
                            Izin yang dibutuhkan
                        </span>
                        <code className="text-amber-900 bg-amber-100/60 px-2 py-1 rounded font-mono text-sm break-all font-semibold block w-fit max-w-full">
                            {neededPermission}
                        </code>
                    </div>
                )}

                <NuraButton
                    label="Kembali ke beranda"
                    variant="primary"
                    className="min-w-[200px] !rounded-full py-3 shadow-lg shadow-emerald-900/10"
                    href="/"
                />
            </div>
        </div>
    );
}
