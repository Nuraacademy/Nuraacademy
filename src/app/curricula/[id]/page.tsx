"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCurriculaDetail } from "@/app/actions/curricula"
import { NuraButton } from "@/components/ui/button/button"
import { toast } from "sonner"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import TitleCard from "@/components/ui/card/title_card"
import PDFViewer from "@/components/ui/video/pdf_viewer"
import { Edit2 } from "lucide-react"

export default function CurriculaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: idParam } = use(params);
    const id = parseInt(idParam);

    const [loading, setLoading] = useState(true);
    const [curricula, setCurricula] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (idParam === "add") {
            router.replace('/curricula/add');
            return;
        }

        if (isNaN(id)) {
            toast.error("Invalid Curricula ID");
            setLoading(false);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            const res = await getCurriculaDetail(id);

            if (res.success && res.curricula) {
                setCurricula(res.curricula);
                setIsAuthorized(true);
            } else if (res.error?.includes("Unauthorized")) {
                setIsAuthorized(false);
                router.push('/');
                return;
            } else {
                toast.error(res.error || "Failed to load curricula");
            }
            setLoading(false);
        };
        loadData();
    }, [id, idParam, router]);

    if (isAuthorized === false) return null;

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-400 animate-pulse font-medium tracking-widest uppercase">Loading Curricula Data...</p>
            </div>
        );
    }

    if (!curricula) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 font-medium tracking-widest uppercase">Curricula Not Found</p>
                <NuraButton label="Back to List" onClick={() => router.push('/curricula')} variant="secondary" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden pb-16">
            {/* Background */}
            <Image
                src="/background/OvalBGLeft.svg"
                alt=""
                className="absolute top-0 left-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <Image
                src="/background/OvalBGRight.svg"
                alt=""
                className="absolute bottom-0 right-0 z-10 w-auto h-[30rem] pointer-events-none opacity-60"
                width={500}
                height={500}
            />
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/classes" },
                        { label: "Curricula", href: "/curricula" },
                        { label: curricula.title, href: `/curricula/${id}` },
                    ]}
                />

                <div className="max-w-7xl mt-8 space-y-6">
                    <TitleCard
                        title={curricula.title}
                        description={`Status: ${curricula.status}`}
                        actions={
                            <div className="flex gap-4">
                                <NuraButton
                                    label="Edit Curricula"
                                    variant="secondary"
                                    onClick={() => router.push(`/curricula/${id}/edit`)}
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    leftIcon={<Edit2 size={16} />}
                                />
                            </div>
                        }
                    />

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <PDFViewer 
                            url={curricula.fileUrl} 
                            title={curricula.title} 
                            editUrl={`/curricula/${id}/edit`}
                            isAdmin={true} // Since they're viewing from management, likely admin/staff
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
