"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/breadcrumb/breadcrumb';
import TitleCard from '@/components/ui/card/title_card';
import { saveGroupSummary } from '@/app/actions/groupSummary';
import { toast } from 'sonner';
import { RichTextInput } from '@/components/ui/input/rich_text_input';
import { NuraButton } from '@/components/ui/button/button';

interface GroupSummaryClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    data: any;
    initialSummaries: any[];
}

export default function GroupSummaryClient({ classId, courseId, moduleId, data, initialSummaries }: GroupSummaryClientProps) {
    const router = useRouter();
    const [summaries, setSummaries] = useState<Record<string, string>>(() => {
        const map: Record<string, string> = {};
        data.groups.forEach((g: any) => {
            const existing = initialSummaries.find(s => s.groupName === g.name);
            map[g.name] = existing?.content || '';
        });
        return map;
    });
    const [isEditingMap, setIsEditingMap] = useState<Record<string, boolean>>({});
    const [selectedGroupName, setSelectedGroupName] = useState<string>(data.groups[0]?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const isAdmin = data.isAdmin;

    const handleSave = async (groupName: string) => {
        const content = summaries[groupName];
        if (!content.trim()) {
            toast.error(`Please enter some content for ${groupName} summary.`);
            return;
        }

        setIsSaving(true);
        const res = await saveGroupSummary({
            sessionId: parseInt(moduleId),
            groupName: groupName,
            content: content
        });

        if (res.success) {
            toast.success(`Summary for ${groupName} saved successfully!`);
            setIsEditingMap(prev => ({ ...prev, [groupName]: false }));
            router.refresh();
        } else {
            toast.error(`Failed to save summary: ${res.error}`);
        }
        setIsSaving(false);
    };

    const breadcrumbItems = [
        { label: "Home", href: "/classes" },
        { label: data.class.title, href: `/classes/${classId}/overview` },
        { label: data.course.title, href: `/classes/${classId}/course/${courseId}/overview` },
        { label: data.session.title, href: `/classes/${classId}/course/${courseId}/session/${moduleId}` },
        { label: "Group Summary", href: "#" },
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-[#FDFDF7] px-6 md:px-10 py-8 space-y-8">
            <Breadcrumb items={breadcrumbItems} />

            <TitleCard title="Group Summary" />
            
            <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 flex flex-col gap-10">
                {/* Admin Select Part */}
                {isAdmin && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900 px-1">Select Group</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.groups.map((group: any) => (
                                <button
                                    key={group.name}
                                    onClick={() => setSelectedGroupName(group.name)}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                                        selectedGroupName === group.name
                                            ? 'bg-[#DAEE49] text-black border-2 border-[#DAEE49] shadow-sm'
                                            : 'bg-white text-gray-500 border-2 border-gray-100 hover:border-[#DAEE49]/30'
                                    }`}
                                >
                                    {group.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Groups Display */}
                <div className="space-y-12">
                    {data.groups
                        .filter((g: any) => !isAdmin || g.name === selectedGroupName)
                        .map((group: any) => (
                            <div key={group.name} className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-3">
                                    <h3 className="text-md font-medium text-gray-900 px-1">Section: {group.name}</h3>
                                    
                                    <div className="bg-[#FBFCF2] rounded-xl p-8 space-y-6 border border-[#F0F5D8]">
                                        {/* Member List */}
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-900 opacity-60">Group Members</h4>
                                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                {group.members.map((member: string, i: number) => (
                                                    <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-100">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#DAEE49]" />
                                                        {member}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-[#F0F5D8]"></div>

                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-900 opacity-60">Question</h4>
                                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                                Berikan summary terkait pembelajaran anda di sesi ini.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-900 opacity-60">Answer</h4>
                                            
                                            {(() => {
                                                const existingSummary = initialSummaries.find(s => s.groupName === group.name);
                                                const isEditing = isEditingMap[group.name] || (!existingSummary && !isAdmin);
                                                const hasContent = !!existingSummary?.content;

                                                if (!isEditing || isAdmin) {
                                                    return (
                                                        <div className="space-y-4">
                                                            {hasContent ? (
                                                                <div 
                                                                    className="rich-text text-xs text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-lg p-6"
                                                                    dangerouslySetInnerHTML={{ __html: existingSummary.content }}
                                                                />
                                                            ) : (
                                                                <div className="text-xs text-gray-400 italic bg-white/50 border border-dashed border-gray-200 rounded-lg p-6 text-center">
                                                                    This group has not submitted their learning summary yet.
                                                                </div>
                                                            )}
                                                            
                                                            {!isAdmin && hasContent && (
                                                                <div className="flex justify-end">
                                                                    <NuraButton
                                                                        label="Edit Summary"
                                                                        variant="secondary"
                                                                        onClick={() => setIsEditingMap(prev => ({ ...prev, [group.name]: true }))}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="space-y-4">
                                                        <div className="mt-2 overflow-hidden bg-white border border-gray-100 rounded-lg">
                                                            <RichTextInput
                                                                value={summaries[group.name]}
                                                                onChange={(val) => setSummaries(prev => ({ ...prev, [group.name]: val }))}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end pt-4 gap-4">
                                                            {hasContent && (
                                                                <NuraButton
                                                                    label="Cancel"
                                                                    variant="secondary"
                                                                    onClick={() => {
                                                                        setSummaries(prev => ({ ...prev, [group.name]: existingSummary.content }));
                                                                        setIsEditingMap(prev => ({ ...prev, [group.name]: false }));
                                                                    }}
                                                                />
                                                            )}
                                                            <NuraButton
                                                                label={isSaving ? "Saving..." : "Submit Summary"}
                                                                variant="primary"
                                                                onClick={() => handleSave(group.name)}
                                                                disabled={isSaving}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {data.groups.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-sm text-gray-500 italic">You are not assigned to any groups in this class.</p>
                        <NuraButton 
                            label="Back to Session" 
                            variant="secondary" 
                            className="mt-4"
                            onClick={() => router.back()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
