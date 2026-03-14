"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NuraTextInput } from "@/components/ui/input/text_input"
import { RichTextInput } from "@/components/ui/input/rich_text_input"
import { NuraButton } from "@/components/ui/button/button"
import { X, Plus, Upload, Image as ImageIcon, Video, Search } from "lucide-react"
import { createClassAction, updateClassAction } from "@/app/actions/classes"
import Image from "next/image"
import { getCurriculaList } from "@/app/actions/curricula"
import { useEffect } from "react"
import { NuraSelect } from "@/components/ui/input/nura_select"

interface AddClassClientProps {
    classData?: any;
    isEditing?: boolean;
}

export default function AddClassClient({ classData, isEditing = false }: AddClassClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState(classData?.title || "");
    const [hours, setHours] = useState(classData?.hours || "");
    const [modules, setModules] = useState(classData?.modules || "");
    const [description, setDescription] = useState(classData?.description || "");
    const [learningObjectives, setLearningObjectives] = useState(classData?.learningObjective || "");
    const [methods, setMethods] = useState(classData?.methods || "");
    const [imgUrl, setImgUrl] = useState(classData?.imgUrl || "");
    const [previewVideoUrl, setPreviewVideoUrl] = useState(classData?.previewVideoUrl || "");

    // Tags state
    const [keywordInput, setKeywordInput] = useState("");
    const [keywords, setKeywords] = useState<string[]>(classData?.keywords || []);
    const [allCurricula, setAllCurricula] = useState<any[]>([]);
    const [selectedCurriculaIds, setSelectedCurriculaIds] = useState<number[]>(
        classData?.curricula?.map((c: any) => c.id) || []
    );

    useEffect(() => {
        const fetchCurricula = async () => {
            const res = await getCurriculaList();
            if (res.success && res.curricula) {
                setAllCurricula(res.curricula);
            }
        };
        fetchCurricula();
    }, []);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput("");
        }
    };

    const handleRemoveKeyword = (tag: string) => {
        setKeywords(keywords.filter(k => k !== tag));
    };

    const handleCurriculaChange = (id: number) => {
        if (selectedCurriculaIds.includes(id)) {
            setSelectedCurriculaIds(selectedCurriculaIds.filter(i => i !== id));
        } else {
            setSelectedCurriculaIds([...selectedCurriculaIds, id]);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        // Add more validation as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);

        const data = {
            title,
            hours: hours ? Number(hours) : undefined,
            modules: modules ? Number(modules) : undefined,
            description,
            learningObjective: learningObjectives,
            methods,
            imgUrl,
            previewVideoUrl,
            keywords,
            curriculaIds: selectedCurriculaIds,
        };

        const res = isEditing
            ? await updateClassAction(classData.id, data)
            : await createClassAction(data);

        setLoading(true);
        if (res.success) {
            router.push('/classes');
        } else {
            alert(res.error || "Failed to save class");
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-4">
            <h1 className="text-2xl font-bold mb-4">{isEditing ? "Edit Class" : "Add Class"}</h1>

            <div className="space-y-8">
                {/* Title and Stats */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-grow">
                        <label className="block text-sm font-semibold mb-2">Class Title</label>
                        <NuraTextInput
                            placeholder="Class title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-semibold mb-2">Total Hours</label>
                        <NuraTextInput
                            variant="number"
                            placeholder="Total hours"
                            value={String(hours)}
                            onChange={(e) => setHours(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-semibold mb-2">Total Modules</label>
                        <NuraTextInput
                            variant="number"
                            placeholder="Total modules"
                            value={String(modules)}
                            onChange={(e) => setModules(e.target.value)}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <RichTextInput value={description} onChange={setDescription} />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Learning Objectives */}
                <div>
                    <label className="block text-sm font-semibold mb-2">What You Will Learn</label>
                    <RichTextInput value={learningObjectives} onChange={setLearningObjectives} />
                </div>

                {/* Picture Banner */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Picture Banner</label>
                    <div className="border-2 border-dashed border-[#D9F55C] rounded-2xl p-10 flex flex-col items-center justify-center bg-[#FEFFF5] text-center">
                        <Upload size={32} className="text-gray-700 mb-2" />
                        <p className="text-sm">
                            <span className="text-gray-600 font-medium underline cursor-pointer">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Maximum file size 5 MB</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">File supported: .jpg, .png, .jpeg</p>
                    <div className="relative flex items-center mt-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium italic">or submit via link</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <NuraTextInput
                        placeholder="Picture banner link"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        className="mt-4"
                    />
                </div>

                {/* Methods */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Methods</label>
                    <RichTextInput value={methods} onChange={setMethods} />
                </div>

                {/* Preview Video */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Preview Class (Video)</label>
                    <div className="border-2 border-dashed border-[#D9F55C] rounded-2xl p-10 flex flex-col items-center justify-center bg-[#FEFFF5] text-center">
                        <Upload size={32} className="text-gray-700 mb-2" />
                        <p className="text-sm">
                            <span className="text-gray-600 font-medium underline cursor-pointer">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Maximum file size 100 MB</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">File supported: .mp4</p>
                    <div className="relative flex items-center mt-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium italic">or submit via link</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                    <NuraTextInput
                        placeholder="Preview class video link"
                        value={previewVideoUrl}
                        onChange={(e) => setPreviewVideoUrl(e.target.value)}
                        className="mt-4"
                    />
                </div>

                {/* Class Keyword */}
                <div>
                    <label className="block text-sm font-semibold mb-2 font-medium">Class Keyword</label>
                    <div className="relative">
                        <NuraTextInput
                            placeholder="Technology; Data; Programming; Product Design; Programming"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                            icon={<Search strokeWidth={1.5} className="text-gray-400" />}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 text-sm">
                        {keywords.map(tag => (
                            <span key={tag} className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-full bg-white shadow-sm">
                                {tag}
                                <button onClick={() => handleRemoveKeyword(tag)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Curricula */}
                <div>
                    <label className="block text-sm font-semibold mb-2 font-medium">Curricula</label>
                    <NuraSelect
                        placeholder="Select Curricula"
                        options={allCurricula.map(c => ({ label: c.title, value: String(c.id) }))}
                        value=""
                        onChange={(val) => handleCurriculaChange(Number(val))}
                    />
                    <div className="flex flex-wrap gap-3 mt-4 text-sm">
                        {selectedCurriculaIds.map(id => {
                            const cur = allCurricula.find(c => c.id === id);
                            return (
                                <span key={id} className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-full bg-white shadow-sm">
                                    {cur?.title || `ID: ${id}`}
                                    <button onClick={() => handleCurriculaChange(id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <X size={14} />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-8 pt-10">
                    <NuraButton
                        label="Cancel"
                        variant="secondary"
                        onClick={() => router.back()}
                    />
                    <NuraButton
                        label={isEditing ? "Update" : "Create"}
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
}
