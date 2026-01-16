"use client"

import * as Dialog from '@radix-ui/react-dialog';
import { X, CheckSquare, Square, List } from 'lucide-react';

interface ModuleItem {
    id: string;
    title: string;
    isCompleted: boolean;
}

interface CourseSection {
    sectionTitle: string;
    modules: ModuleItem[];
}

const courseOutline: CourseSection[] = [
    {
        sectionTitle: "Pengenalan Pemrograman & Google Colab",
        modules: [
            { id: "1", title: "Konsep Dasar Pemrograman", isCompleted: true },
            { id: "2", title: "Cara Kerja Program (Input-Process-Output)", isCompleted: true },
            { id: "3", title: "Pengenalan Google Colab & Environment Python", isCompleted: true },
        ]
    },
    {
        sectionTitle: "Pengenalan Pemrograman & Google Colab", // Repeated in image
        modules: [
            { id: "4", title: "Konsep Dasar Pemrograman", isCompleted: false },
            { id: "5", title: "Cara Kerja Program (Input-Process-Output)", isCompleted: false },
            { id: "6", title: "Pengenalan Google Colab & Environment Python", isCompleted: false },
        ]
    },
    {
        sectionTitle: "Dasar Python & Variabel",
        modules: [
            { id: "7", title: "Kelas Zoom", isCompleted: false },
        ]
    },
    {
        sectionTitle: "Dasar Python & Variabel",
        modules: [
            { id: "8", title: "Rekaman Video", isCompleted: false },
        ]
    }
];

export const ClassOutlineDialog = ({ classId }: { classId: string }) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button 
                    type="button" 
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors outline-none cursor-pointer"
                >
                    <List size={18} /> 
                    <span>Contents</span>
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" 
                />
                
                <Dialog.Content 
                    className="fixed w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl z-[10000] animate-in fade-in zoom-in-95 duration-200 focus:outline-none"
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="flex justify-between items-center mb-8 sticky top-0 bg-white">
                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                            Table of Contents
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                                <X size={24} className="text-gray-400 group-hover:text-black" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="space-y-8">
                        {courseOutline.map((section, sIndex) => (
                            <div key={sIndex} className="space-y-4">
                                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                                    {section.sectionTitle}
                                </h3>
                                <ul className="space-y-4 ml-1">
                                    {section.modules.map((module) => (
                                        <li key={module.id} className="flex items-start gap-3 group cursor-pointer">
                                            <div className="mt-0.5 flex-shrink-0">
                                                {module.isCompleted ? (
                                                    <CheckSquare size={20} className="text-black" />
                                                ) : (
                                                    <Square size={20} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${module.isCompleted ? 'text-gray-900' : 'text-gray-600'} group-hover:text-black transition-colors`}>
                                                <a href={`/modules/${module.id}`}>{module.title}</a>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};


