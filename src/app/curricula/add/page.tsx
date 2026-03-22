"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createCurriculaAction, uploadCurriculaFile, getCurriculaList } from "@/app/actions/curricula"
import { NuraButton } from "@/components/ui/button/button"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { toast } from "sonner"
import FileUpload from "@/components/ui/upload/file_upload"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"

export default function AddCurriculaPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await getCurriculaList("", "");
            if (res.success) {
                setIsAuthorized(true);
            } else if (res.error?.includes("Unauthorized")) {
                setIsAuthorized(false);
                router.push('/');
            }
        };
        checkAuth();
    }, []);

    if (isAuthorized === false) return null;

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        setIsSubmitting(true);
        try {
            let fileUrl = "";
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await uploadCurriculaFile(formData);
                if (uploadRes.success && uploadRes.url) {
                    fileUrl = uploadRes.url;
                } else {
                    toast.error(uploadRes.error || "Failed to upload file");
                    setIsSubmitting(false);
                    return;
                }
            }

            const res = await createCurriculaAction({
                title,
                fileUrl,
                status: "Active"
            });

            if (res.success) {
                toast.success("Curricula created successfully");
                router.push('/curricula');
                router.refresh();
            } else {
                toast.error(res.error || "Failed to create curricula");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden  pb-16">
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
                        { label: "Home", href: "/" },
                        { label: "Curricula", href: "/curricula" },
                        { label: "Add Curricula", href: "/curricula/add" },
                    ]}
                />

                <div className="max-w-7xl mt-8 space-y-8">
                    <h1 className="text-2xl font-medium text-gray-900">Add Curricula</h1>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Curricula Title</label>
                        <NuraTextInput
                            placeholder="Curricula title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-900">Upload Curricula</label>
                        <div className="relative">
                            <FileUpload
                                onFileSelect={setSelectedFile}
                                accept=".csv,.pdf"
                                supportedFileType=".pdf"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-8 pt-10">
                        <NuraButton
                            label="Cancel"
                            variant="secondary"
                            onClick={() => router.back()}
                        />
                        <NuraButton
                            label={isSubmitting ? "Creating..." : "Create"}
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
