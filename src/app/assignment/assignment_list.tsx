"use client"

import { useState } from "react";
import { NuraSelect } from "@/components/ui/input/nura_select";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { AssignmentCard } from "@/components/ui/card/assignment_card";
import { mapPrismaAssignmentType } from "@/utils/assignment";

interface AssignmentListProps {
    initialAssignments: any[];
}

export default function AssignmentList({ initialAssignments }: AssignmentListProps) {
    const [searchValue, setSearchValue] = useState("");
    const [assignmentType, setAssignmentType] = useState("all");

    const filteredAssignments = initialAssignments.filter((assignment) => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchValue.toLowerCase());
        const uiType = mapPrismaAssignmentType(assignment.type);
        const matchesType = assignmentType === "all" || uiType.toLowerCase().replace(/\s/g, "") === assignmentType.toLowerCase();
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <NuraSearchInput
                    className="w-full md:w-72"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <NuraSelect
                    className="w-full md:w-48"
                    value={assignmentType}
                    onChange={setAssignmentType}
                    options={[
                        { label: "All", value: "all" },
                        { label: "Placement Test", value: "placement" },
                        { label: "Pre Test", value: "pretest" },
                        { label: "Post Test", value: "posttest" },
                        { label: "Assignment", value: "assignment" },
                        { label: "Exercise", value: "exercise" },
                        { label: "Final Project", value: "finalproject" },
                    ]}
                    placeholder="Type"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 pb-20">
                {filteredAssignments.map((assignment) => (
                    <AssignmentCard
                        key={assignment.id}
                        title={assignment.title}
                        tag={assignment.submissionType === "GROUP" ? "Group" : "Individual"}
                        classId={String(assignment.classId)}
                        courseId={String(assignment.courseId)}
                        sessionId={String(assignment.sessionId)}
                        className={assignment.class?.title || "Unknown Class"}
                        courseName={assignment.course?.title || "Unknown Course"}
                        type={mapPrismaAssignmentType(assignment.type)}
                    />
                ))}
                {filteredAssignments.length === 0 && (
                    <p className="text-center text-gray-500 py-10">No assignments found.</p>
                )}
            </div>
        </div>
    );
}
