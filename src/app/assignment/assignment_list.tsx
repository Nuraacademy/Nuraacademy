"use client"

import { useState } from "react";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { NuraButton } from "@/components/ui/button/button";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { AssignmentCard } from "@/components/ui/card/assignment_card";
import { mapPrismaAssignmentType } from "@/utils/assignment";

import Link from "next/link";
import Image from "next/image";

interface AssignmentListProps {
    initialAssignments: any[];
    canAddAssignment: boolean;
    canDeleteAssignment: boolean;
    canGrade: boolean;
}

export default function AssignmentList({ initialAssignments, canAddAssignment, canDeleteAssignment, canGrade }: AssignmentListProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [assignmentType, setAssignmentType] = useState("all");

    const filteredAssignments = initialAssignments.filter((assignment) => {
        const matchesSearch = assignment.title?.toLowerCase().includes(searchValue.toLowerCase()) || true;
        const uiType = mapPrismaAssignmentType(assignment.type);
        const matchesType = assignmentType === "all" || uiType.toLowerCase().replace(/\s/g, "") === assignmentType.toLowerCase();
        return matchesSearch && matchesType;
    });

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Image */}
            <Image
                src="/background/PolygonBGTop.svg"
                alt=""
                className="absolute top-0 left-0 -z-10 w-auto h-[40rem] pointer-events-none"
                width={500}
                height={500}
                priority
            />
            <Image
                src="/background/PolygonBGBot.svg"
                alt=""
                className="absolute bottom-0 right-0 -z-10 w-auto h-[40rem] pointer-events-none"
                width={500}
                height={500}
            />

            {/* Content */}
            <div className="text-black md:px-12 py-6 space-y-6 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-medium">
                    Assignments
                </h1>

                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    <NuraSearchInput
                        className="w-full md:w-72"
                        placeholder="Search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <NuraSelect
                            className="w-full md:w-48"
                            value={assignmentType}
                            onChange={setAssignmentType}
                            options={[
                                { label: "All", value: "all" },
                                { label: "Placement Test", value: "PLACEMENT" },
                                { label: "Pre Test", value: "PRETEST" },
                                { label: "Post Test", value: "POSTTEST" },
                                { label: "Assignment", value: "ASSIGNMENT" },
                                { label: "Exercise", value: "EXERCISE" },
                                { label: "Final Project", value: "PROJECT" },
                            ]}
                            placeholder="Type"
                        />

                        {canAddAssignment && (
                            <Link href="/assignment/add">
                                <NuraButton
                                    label="Add Assignment"
                                    variant="primary"
                                />
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pb-20">
                    {filteredAssignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            id={assignment.id}
                            title={assignment.title}
                            tag={assignment.submissionType === "GROUP" ? "Group" : "Individual"}
                            classId={String(assignment.classId)}
                            courseId={String(assignment.courseId)}
                            sessionId={String(assignment.sessionId)}
                            classTitle={assignment.class?.title || "Unknown Class"}
                            courseTitle={assignment.course?.title}
                            type={mapPrismaAssignmentType(assignment.type)}
                            isAdmin={canDeleteAssignment}
                            canGrade={canGrade}
                            syntheticType={(assignment as any).syntheticType}
                        />
                    ))}
                    {filteredAssignments.length === 0 && (
                        <p className="text-center text-gray-500 py-10">No assignments found.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
