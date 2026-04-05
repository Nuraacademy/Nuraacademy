"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NuraButton } from "@/components/ui/button/button";
import { updatePresence } from "@/app/actions/session";
import { toast } from "sonner";

interface StudentPresence {
    enrollmentId: number;
    name: string;
    status: string;
    sesScore: number;
}

interface PresenceClientProps {
    classId: string;
    courseId: string;
    moduleId: string;
    initialStudents: StudentPresence[];
    canEdit: boolean;
}

export default function PresenceClient({
    classId,
    courseId,
    moduleId,
    initialStudents,
    canEdit
}: PresenceClientProps) {
    const router = useRouter();
    const [students, setStudents] = useState<StudentPresence[]>(initialStudents);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (enrollmentId: number, status: string) => {
        if (!canEdit) return;
        setStudents(prev => prev.map(s =>
            s.enrollmentId === enrollmentId ? { ...s, status } : s
        ));
    };

    const handleScoreChange = (enrollmentId: number, value: string) => {
        if (!canEdit) return;
        
        let score = value === "" ? 0 : parseFloat(value);
        if (isNaN(score)) score = 0;
        
        // Clamp between 0 and 10
        if (score < 0) score = 0;
        if (score > 10) score = 10;

        setStudents(prev => prev.map(s =>
            s.enrollmentId === enrollmentId ? { ...s, sesScore: score } : s
        ));
    };

    const handleSave = async () => {
        if (!canEdit) return;
        setLoading(true);
        try {
            const updates = students.map(s => ({
                enrollmentId: s.enrollmentId,
                status: s.status,
                score: s.sesScore
            }));

            const result = await updatePresence(parseInt(moduleId), classId, courseId, updates);
            if (result.success) {
                toast.success("Presence and SES scores updated successfully!");
                router.refresh();
            } else {
                toast.error("Failed to update: " + result.error);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Table */}
            <div className="w-full border border-black rounded-xl overflow-hidden mb-12">
                {/* Table Header */}
                <div className="grid grid-cols-12 border-b border-black bg-white px-8 py-5">
                    <div className="col-span-4 text-sm font-semibold text-black text-left">Name</div>
                    <div className="col-span-1 text-sm font-semibold text-black text-center">Attend</div>
                    <div className="col-span-1 text-sm font-semibold text-black text-center">Sick</div>
                    <div className="col-span-1 text-sm font-semibold text-black text-center">Permit</div>
                    <div className="col-span-1 text-sm font-semibold text-black text-center">Absent</div>
                    <div className="col-span-4 text-sm font-semibold text-black text-right">SES Score</div>
                </div>

                {/* Table Rows */}
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <div
                            key={student.enrollmentId}
                            className={`grid grid-cols-12 px-8 py-5 border-black ${index !== students.length - 1 ? 'border-b' : ''} bg-white items-center`}
                        >
                            <div className="col-span-4 text-sm text-black font-medium">{student.name}</div>

                            {/* Radio Buttons */}
                            {["attend", "sick", "permit", "absent"].map((status) => (
                                <div key={status} className="col-span-1 flex justify-center">
                                    <button
                                        type="button"
                                        disabled={!canEdit}
                                        onClick={() => handleStatusChange(student.enrollmentId, status)}
                                        className={`w-6 h-6 rounded-full border-2 border-black flex items-center justify-center p-1 transition-colors ${!canEdit ? 'cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                    >
                                        {student.status === status && <div className="w-full h-full bg-black rounded-full" />}
                                    </button>
                                </div>
                            ))}

                            {/* SES Score Input */}
                            <div className="col-span-4 flex justify-end">
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="1"
                                    disabled={!canEdit}
                                    value={student.sesScore ?? ""}
                                    onChange={(e) => handleScoreChange(student.enrollmentId, e.target.value)}
                                    className={`w-20 text-right border-b border-black focus:outline-none bg-transparent px-1 text-sm font-medium ${!canEdit ? 'opacity-70 cursor-not-allowed' : 'focus:border-[#00524D]' }`}
                                />/10
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-8 py-5 text-center text-gray-500 bg-white">No students enrolled in this class.</div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <NuraButton
                    label="Back to Session"
                    variant="secondary"
                    className="min-w-[160px]"
                    onClick={() => router.push(`/classes/${classId}/course/${courseId}/session/${moduleId}`)}
                />
                {canEdit && (
                    <NuraButton
                        label={loading ? "Saving..." : "Save Changes"}
                        variant="primary"
                        className="min-w-[160px]"
                        disabled={loading}
                        onClick={handleSave}
                    />
                )}
            </div>
        </div>
    );
}
