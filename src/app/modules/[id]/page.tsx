"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import { 
    ChevronLeft, 
    ChevronRight, 
    Pencil, 
    Save, 
    Trash2, 
    Plus, 
    X
} from 'lucide-react';
import { RichTextInput } from '@/components/rich_text_input';
import { Header2 } from '@/components/header2';

export default function ModuleDetailPage(
    { params }: {
        params: { id: string }
    } 
) {
    const isAdmin = true;

    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        moduleId: "1",
        classId: "1",
        classTitle: "Introduction to Programming",
        courseId: "1",
        courseTitle: "Pengenalan Pemrograman & Google Colab",
        title: "Konsep Dasar Pemrograman",
        prev: "Introduction",
        next: "Data Types & Variables",
        sections: [
            { id: "s1", type: 'text', value: "<p>Python is a <strong>high-level</strong> programming language...</p>" },
            { id: "s2", type: 'image', value: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop" },
        ]
    });

    const updateSection = (id: string, value: string) => {
        setData((prev) => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, value } : s)
        }));
    };

    const addSection = (type: 'text' | 'image') => {
        const newSection = { id: crypto.randomUUID(), type, value: "" };
        setData({ ...data, sections: [...data.sections, newSection] });
    };

    const removeSection = (id: string) => {
        setData({ ...data, sections: data.sections.filter(s => s.id !== id) });
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
            <Header2 classId={data.classId} />
            
            <div className="flex-grow mx-auto w-full p-8 md:p-16">
                <div className="mb-4 text-[#a2a2a2]">
                    {data.classTitle}/{data.courseTitle}/{data.title}
                </div>
                <article className={`relative border rounded-[2.5rem] p-8 md:p-12 transition-all duration-300 ${isEditing ? 'border-[#D9F066] bg-gray-50/20 ring-1 ring-[#D9F066]' : 'border-black shadow-sm'}`}>
                    <div className="absolute top-8 right-8 flex gap-2 z-10">
                        {isAdmin && (
                            <button 
                                onClick={() => {
                                    setIsEditing(!isEditing);
                                }} 
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${isEditing ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 hover:bg-[#D9F066] text-black'}`}
                            >
                                {isEditing ? <><X size={14}/> Close Editor</> : <><Pencil size={14}/> Edit Mode</>}
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div>
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Module Header</h2>
                                <input 
                                    className="w-full text-3xl font-bold border-b-2 border-gray-100 py-2 bg-transparent focus:outline-none focus:border-[#D9F066] transition-colors"
                                    value={data.title}
                                    onChange={(e) => { setData({...data, title: e.target.value}) }}
                                    placeholder="Enter module title..."
                                />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Content Sections</h2>
                                {data.sections.map((section, index) => (
                                    <div key={section.id} className="bg-white border border-gray-200 p-5 rounded-[1.5rem] shadow-sm relative group">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded">
                                                {section.type} section {index + 1}
                                            </span>
                                            <button onClick={() => removeSection(section.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>

                                        {section.type === 'text' ? (
                                            <RichTextInput 
                                                value={section.value} 
                                                onChange={(val) => updateSection(section.id, val)} 
                                            />
                                        ) : (
                                            <div className="space-y-3">
                                                <input 
                                                    className="w-full text-xs bg-gray-50 p-3 rounded-xl border border-transparent focus:border-gray-200 focus:outline-none"
                                                    value={section.value}
                                                    onChange={(e) => updateSection(section.id, e.target.value)}
                                                    placeholder="Paste image URL here..."
                                                />
                                                {section.value && (
                                                    <img src={section.value} className="h-fill w-full object-cover rounded-xl border border-gray-100" alt="Preview" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 py-8 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white/50">
                                <button onClick={() => addSection('text')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors">
                                    <Plus size={16}/> Add Text Block
                                </button>
                                <div className="w-[1px] h-6 bg-gray-200 self-center" />
                                <button onClick={() => addSection('image')} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors">
                                    <Plus size={16}/> Add Image Block
                                </button>
                            </div>

                            <button 
                                onClick={() => { setIsEditing(false); toast.success("Module saved successfully!"); }} 
                                className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-900 transition-all active:scale-[0.98]"
                            >
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <h1 className="text-4xl font-bold text-gray-900">{data.title}</h1>
                            {data.sections.map((section) => (
                                <div key={section.id} className="animate-in fade-in duration-1000">
                                    {section.type === 'text' ? (
                                        <div 
                                            className="text-gray-700 leading-relaxed prose prose-slate max-w-none prose-headings:font-bold prose-p:text-base" 
                                            dangerouslySetInnerHTML={{ __html: section.value }} 
                                        />
                                    ) : (
                                        <div className="my-10 overflow-hidden rounded-[2rem] shadow-md border border-gray-100">
                                             <img src={section.value || "https://via.placeholder.com/800x400?text=No+Image+Provided"} className="w-full h-auto object-cover" alt="Module visual" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
            
            <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-10 py-6 flex justify-between items-center z-30">
                <button className="flex items-center gap-3 text-gray-400 font-bold text-sm transition-colors hover:text-gray-600">
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center bg-white"><ChevronLeft size={24}/></div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase text-gray-300">Previous</span>
                        {data.prev}
                    </div>
                </button>
                <button className="flex items-center gap-4 text-black font-bold text-sm group">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase text-gray-400">Next Module</span>
                        {data.next}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <ChevronRight size={24}/>
                    </div>
                </button>
            </footer>
        </main>
    );
}