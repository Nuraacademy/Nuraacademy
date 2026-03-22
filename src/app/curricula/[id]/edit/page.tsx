"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { getCurriculaDetail, updateCurriculaAction, uploadCurriculaFile } from "@/app/actions/curricula"
import { getClassesAction } from "@/app/actions/classes"
import { NuraButton } from "@/components/ui/button/button"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { Search, X, FileText } from "lucide-react"
import { toast } from "sonner"
import FileUpload from "@/components/ui/upload/file_upload"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"

export default function EditCurriculaPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: idParam } = use(params);
    const id = parseInt(idParam);

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("Active");
    const [fileUrl, setFileUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Class selection state
    const [allClasses, setAllClasses] = useState<any[]>([]);
    const [classSearch, setClassSearch] = useState("");
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [curRes, classRes] = await Promise.all([
                getCurriculaDetail(id),
                getClassesAction()
            ]);

            if (curRes.success && curRes.curricula) {
                const cur = curRes.curricula;
                setTitle(cur.title);
                setStatus(cur.status);
                setFileUrl(cur.fileUrl || "");
                setSelectedClassIds(cur.classes.map((c: any) => c.id));
                setIsAuthorized(true);
            } else if (curRes.error?.includes("Unauthorized")) {
                setIsAuthorized(false);
                router.push('/');
                return;
            } else {
                toast.error(curRes.error || "Failed to load curricula");
            }

            if (classRes.success && classRes.classes) {
                setAllClasses(classRes.classes);
            }
            setLoading(false);
        };
        loadData();
    }, [id]);

    if (isAuthorized === false) return null;

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalFileUrl = fileUrl;
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await uploadCurriculaFile(formData);
                if (uploadRes.success && uploadRes.url) {
                    finalFileUrl = uploadRes.url;
                } else {
                    toast.error(uploadRes.error || "Failed to upload file");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await updateCurriculaAction(id, {
                title,
                status,
                fileUrl: finalFileUrl,
                classIds: selectedClassIds
            });

            if (res.success) {
                toast.success("Curricula updated successfully");
                router.push('/curricula');
                router.refresh();
            } else {
                toast.error(res.error || "Failed to update curricula");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleClassSelection = (classId: number) => {
        if (selectedClassIds.includes(classId)) {
            setSelectedClassIds(selectedClassIds.filter(i => i !== classId));
        } else {
            setSelectedClassIds([...selectedClassIds, classId]);
        }
    };

    const filteredClasses = classSearch.trim()
        ? allClasses.filter(c => c.title.toLowerCase().includes(classSearch.toLowerCase()) && !selectedClassIds.includes(c.id))
        : [];

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-400 animate-pulse font-medium tracking-widest uppercase">Loading Curricula Data...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans pb-16">
            <img
                src="/background/OvalBGLeft.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/OvalBGRight.svg"
                alt="Background"
                className="absolute h-[40rem] object-cover bottom-0 right-0"
            />
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Curricula", href: "/curricula" },
                        { label: title, href: `/curricula/${id}/edit` },
                        { label: "Edit Curricula", href: `/curricula/${id}/edit` },
                    ]}
                />

                <div className="max-w-7xl mt-8 space-y-8">
                    <h1 className="text-2xl font-medium text-gray-900">Edit Curricula</h1>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Curricula Title</label>
                        <NuraTextInput
                            placeholder="Curricula title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Upload Curricula</label>
                        <div className="relative">
                            {fileUrl && !selectedFile && (
                                <div className="mb-2 flex items-center gap-2 group">
                                    <div className="p-1.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                        <FileText size={14} className="text-green-600" />
                                    </div>
                                    <span className="text-xs font-medium text-green-700">Existing: {fileUrl.split('/').pop()}</span>
                                </div>
                            )}
                            <FileUpload
                                onFileSelect={setSelectedFile}
                                accept=".csv,.pdf"
                                supportedFileType=".pdf"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400">Maximum file size 5 MB. Supported format: .pdf, .csv</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-semibold text-gray-900">Class Related</label>
                        <div className="relative">
                            <NuraTextInput
                                placeholder="Class title"
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                                icon={<Search size={18} className="text-gray-400" />}
                                className="bg-white"
                            />
                            {filteredClasses.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl mt-1 shadow-lg z-30 max-h-48 overflow-y-auto">
                                    {filteredClasses.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => {
                                                toggleClassSelection(c.id);
                                                setClassSearch("");
                                            }}
                                            className="w-full text-left p-3 hover:bg-gray-50 text-xs font-medium transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            {c.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedClassIds.map(id => {
                                const c = allClasses.find(item => item.id === id);
                                return (
                                    <div key={id} className="flex items-center gap-2 px-4 py-1.5 border border-gray-100 rounded-full bg-white shadow-sm text-xs font-medium text-gray-900">
                                        {c?.title || `Class ID: ${id}`}
                                        <button
                                            onClick={() => toggleClassSelection(id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-8">
                        <button
                            onClick={() => setStatus(status === 'Active' ? 'Deactivated' : 'Active')}
                            className={`px-8 h-10 rounded-full border text-sm font-medium transition-all ${status === 'Active'
                                ? 'bg-white border-[#cdff2b] text-gray-900'
                                : 'bg-gray-50 border-gray-200 text-gray-300'
                                }`}
                        >
                            {status}
                        </button>
                        <div className="flex gap-8 items-center">
                            <NuraButton
                                label="Cancel"
                                variant="secondary"
                                onClick={() => router.back()}
                            />
                            <NuraButton
                                label={isSubmitting ? "Processing..." : "Save Changes"}
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
