"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurriculaList, deleteCurriculaAction } from "@/app/actions/curricula"
import { NuraButton } from "@/components/ui/button/button"
import { NuraSearchInput } from "@/components/ui/input/nura_search_input"
import { NuraSelect } from "@/components/ui/input/nura_select"
import { Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"
import Image from "next/image"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"

export default function CurriculaPage() {
    const router = useRouter();
    const [curricula, setCurricula] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    const fetchCurricula = async () => {
        setLoading(true);
        const res = await getCurriculaList(search, statusFilter);
        if (res.success) {
            setCurricula(res.curricula || []);
            setIsAuthorized(true);
        } else if (res.error?.includes("Unauthorized")) {
            setIsAuthorized(false);
            router.push('/');
        }
        setLoading(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCurricula();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, statusFilter]);

    if (isAuthorized === false) return null;

    const handleDelete = async () => {
        if (!deleteId) return;
        const res = await deleteCurriculaAction(deleteId);
        if (res.success) {
            toast.success("Curricula deleted successfully");
            fetchCurricula();
        } else {
            toast.error(res.error || "Failed to delete curricula");
        }
        setDeleteId(null);
    };

    return (
        <div className="w-full min-h-screen relative overflow-hidden bg-white">
            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0 pointer-events-none opacity-60"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0 pointer-events-none opacity-60"
            />
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Curricula", href: "/curricula" },
                        ]}
                    />

                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Curricula</h1>
                        <div className="flex gap-4 items-center">
                            <div className="w-40">
                                <NuraSelect
                                    placeholder="Status"
                                    options={[
                                        { label: "All Status", value: "" },
                                        { label: "Active", value: "Active" },
                                        { label: "Deactivated", value: "Deactivated" }
                                    ]}
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                />
                            </div>
                            <NuraButton
                                label="Add Curricula"
                                variant="primary"
                                onClick={() => router.push('/curricula/add')}
                                className="bg-[#cdff2b] hover:bg-[#bce627] text-gray-900 border-none px-10 h-10 rounded-full font-bold shadow-lg shadow-[#cdff2b33] transition-all"
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-md">
                        <NuraSearchInput
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <div className="flex justify-center p-20 text-gray-400 font-medium">Loading Curricula...</div>
                        ) : curricula.length === 0 ? (
                            <div className="flex justify-center p-20 text-gray-400 font-medium">No curricula found.</div>
                        ) : (
                            curricula.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-center justify-between bg-white p-4 px-6 rounded-2xl border border-gray-100 hover:border-[#cdff2b] hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#cdff2b11]">
                                            <Image
                                                src="/icons/Curricula.svg"
                                                alt="folder"
                                                width={28}
                                                height={28}
                                                className="opacity-70 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-950 transition-colors tracking-tight">{item.title}</h3>
                                            <div className="flex gap-3 items-center mt-0.5">
                                                {item.classes.length > 0 ? (
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {item.classes.length} {item.classes.length === 1 ? 'CLASS' : 'CLASSES'} LINKED
                                                    </p>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">UNLINKED</p>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-[#cdff2b]' : 'bg-gray-300'}`} />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 group-hover:text-gray-500">{item.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setDeleteId(item.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 bg-transparent rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/curricula/${item.id}/edit`)}
                                            className="p-2 text-gray-300 hover:text-gray-900 bg-transparent rounded-xl transition-all"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Curricula"
                message={<p className="text-gray-600 font-medium">Are you sure you want to delete this curricula? <span className="text-red-500 block mt-1">This action cannot be undone.</span></p>}
            />
        </div>
    );
}
