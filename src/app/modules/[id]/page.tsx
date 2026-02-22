"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import {
    ChevronLeft, ChevronRight, Pencil, Save,
    Trash2, Plus, X, Upload
} from 'lucide-react';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { Header2 } from '@/components/header2';
import { SubmissionStatusTable } from '@/components/submission_status_table';
import { LimeButton } from '@/components/lime_button';
import { UploadModal } from '@/components/upload_file';
import { ConfirmModal } from '@/components/ui/modal/confirmation_modal';

export default function ModuleDetailPage({ params }: { params: { id: string } }) {
    const isAdmin = true;
    const isAssignment = false;

    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [submission, setSubmission] = useState({
        grade: 9.3,
        file: null as File | null,
        review: "good",
        feedback: "Okay"
    });


    const [data, setData] = useState({
        classId: "1",
        classTitle: "Introduction to Programming",
        courseTitle: "Pengenalan Pemrograman & Google Colab",
        title: "Konsep Dasar Pemrograman",
        instruction: "Kamu telah membaca semua modul pada course ini. Silahkan buat essay yang berkaitan dengan materi tersebut dalam format pdf.",
        prev: "Introduction",
        next: "Data Types & Variables",
        sections: [
            { id: "s1", type: 'text' as const, value: "<p>Python is a <strong>high-level</strong> programming language...</p>" },
            { id: "s2", type: 'image' as const, value: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop" },
        ]
    });

    // --- Logic Handlers ---
    const updateSection = (id: string, value: string) => {
        setData(prev => ({ ...prev, sections: prev.sections.map(s => s.id === id ? { ...s, value } : s) }));
    };

    const addSection = (type: 'text' | 'image') => {
        setData(prev => ({ ...prev, sections: [...prev.sections, { id: crypto.randomUUID(), type, value: "" }] }));
    };

    const handleSave = () => {
        setIsEditing(false);
        toast.success("Module saved successfully!");
    };

    const handleSaveAttempt = () => {
        setIsConfirmOpen(true);
    };

    const handleFinalSave = () => {
        // Logic to save data to database goes here
        setIsConfirmOpen(false);
        if (!submission.file) {
            toast.error("File can not be empty");
        } else {
            toast.success("Course saved successfully!");
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
            <Header2 classId={data.classId} />

            <div className="flex-grow mx-auto w-full py-8 md:px-16">
                {/* Breadcrumbs */}
                <div className="mb-4 text-[#a2a2a2] text-sm">
                    {data.classTitle} / {data.courseTitle} / {data.title}
                </div>

                <article className={`relative border rounded-[2.5rem] p-8 md:p-12 transition-all duration-300 ${isEditing ? 'border-[#D9F066] bg-gray-50/20 ring-1 ring-[#D9F066]' : 'border-black shadow-sm'}`}>

                    {/* Admin Toggle */}
                    {isAdmin && (
                        <div className="absolute top-8 right-8 z-10">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${isEditing ? 'bg-black text-white' : 'bg-gray-100 hover:bg-[#D9F066]'}`}
                            >
                                {isEditing ? <><X size={14} /> Close Editor</> : <><Pencil size={14} /> Edit Mode</>}
                            </button>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <header>
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Module Header</h2>
                                <input
                                    className="w-full text-3xl font-bold border-b-2 border-gray-100 py-2 bg-transparent focus:outline-none focus:border-[#D9F066] transition-colors"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                />
                            </header>

                            {isAssignment ? (
                                <div className="space-y-6">
                                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Assignment Instructions</h2>
                                    <RichTextInput value={data.instruction} onChange={(val) => setData({ ...data, instruction: val })} />
                                </div>
                            ) : (
                                <EditorContentSections data={data} updateSection={updateSection} removeSection={(id: string) => setData({ ...data, sections: data.sections.filter(s => s.id !== id) })} addSection={addSection} />
                            )}

                            <button onClick={handleSave} className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-900 transition-all active:scale-95">
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <h1 className="text-2xl font-medium text-gray-900">{isAssignment && "Assignment: "}{data.title}</h1>

                            {isAssignment ? (
                                <>
                                    <div className="text-gray-700 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: data.instruction }} />
                                    <SubmissionStatusTable {...submission} />
                                    <div className="flex justify-end gap-2">
                                        <LimeButton label="Upload File" variant="outline" onClick={() => setIsModalOpen(true)} />
                                        <LimeButton label="Submit" variant="solid" onClick={handleSaveAttempt} />
                                        {/* Confirmation Modal */}
                                        <ConfirmModal
                                            isOpen={isConfirmOpen}
                                            title="Submit File"
                                            message="Are you sure want to submit this file?"
                                            onConfirm={handleFinalSave}
                                            onCancel={() => setIsConfirmOpen(false)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-8">
                                    {data.sections.map(section => (
                                        <SectionRenderer key={section.id} section={section} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </article>
            </div>

            <NavigationFooter prev={data.prev} next={data.next} />
            {isModalOpen &&
                <UploadModal
                    onClose={() => setIsModalOpen(false)}
                    onUploadSuccess={(uploadedFile) => {
                        setSubmission(prev => ({ ...prev, file: uploadedFile as File }));
                    }}
                />
            }
        </main>
    );
}


function SectionRenderer({ section }: { section: any }) {
    return (
        <div className="animate-in fade-in duration-700">
            {section.type === 'text' ? (
                <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: section.value }} />
            ) : (
                <div className="my-10 overflow-hidden rounded-[2rem] shadow-md border border-gray-100">
                    <img src={section.value || "https://via.placeholder.com/800x400"} className="w-full h-auto object-cover" alt="Content" />
                </div>
            )}
        </div>
    );
}

function EditorContentSections({ data, updateSection, removeSection, addSection }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Content Sections</h2>
            {data.sections.map((section: any, index: number) => (
                <div key={section.id} className="bg-white border border-gray-200 p-5 rounded-[1.5rem] shadow-sm relative group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">{section.type} {index + 1}</span>
                        <button onClick={() => removeSection(section.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                    {section.type === 'text' ? (
                        <RichTextInput value={section.value} onChange={(val) => updateSection(section.id, val)} />
                    ) : (
                        <input className="w-full text-xs bg-gray-50 p-3 rounded-xl border focus:border-gray-200 outline-none" value={section.value} onChange={(e) => updateSection(section.id, e.target.value)} placeholder="Image URL..." />
                    )}
                </div>
            ))}
            <div className="flex justify-center gap-4 py-8 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white/50">
                <button onClick={() => addSection('text')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"><Plus size={16} /> Text</button>
                <button onClick={() => addSection('image')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"><Plus size={16} /> Image</button>
            </div>
        </div>
    );
}

function NavigationFooter({ prev, next }: { prev: string, next: string }) {
    return (
        <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-10 py-6 flex justify-between items-center z-30">
            <button className="flex items-center gap-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white"><ChevronLeft size={24} /></div>
                <div className="flex flex-col items-start"><span className="text-[10px] uppercase text-gray-300">Previous</span>{prev}</div>
            </button>
            <button className="flex items-center gap-4 text-black font-bold text-sm group">
                <div className="flex flex-col items-end"><span className="text-[10px] uppercase text-gray-400">Next Module</span>{next}</div>
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm"><ChevronRight size={24} /></div>
            </button>
        </footer>
    );
}
