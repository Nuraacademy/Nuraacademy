"use client";

import { useState } from "react";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import { CourseCard, ProjectCard, AddCourseButton, AddAssignmentButton } from "./client_button";

interface CourseListClientProps {
    classId: string;
    initialCourses: any[];
    projectAssignments: any[];
    canCreateCourse: boolean;
    canUpdateCourse: boolean;
    isLearner: boolean;
}

export default function CourseListClient({
    classId,
    initialCourses,
    projectAssignments,
    canCreateCourse,
    canUpdateCourse,
    isLearner
}: CourseListClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter assignments based on visibility logic (same as original page.tsx)
    const visibleAssignments = projectAssignments.filter(a => {
        // if (canUpdateCourse) return true; // Admin/Staff sees all
        // if (!a.startDate) return true;
        // return new Date(a.startDate) <= new Date();
        return true
    });

    // Filter courses based on search query
    const filteredCourses = initialCourses.filter(course => 
        (course.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Filter assignments based on search query
    const filteredAssignments = visibleAssignments.filter(assignment =>
        (assignment.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasResults = filteredCourses.length > 0 || filteredAssignments.length > 0;

    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-black/[0.02] border border-gray-100 flex flex-col gap-6 h-full">
            {/* Header with Search and Buttons */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-lg">Courses & Curriculum</h2>
                        <p className="text-xs text-gray-400 font-medium mt-1">Explore modules and assignments in this class.</p>
                    </div>
                    {canCreateCourse && (
                        <div className="flex items-center gap-2">
                            <AddCourseButton classId={classId} />
                            <AddAssignmentButton classId={classId} />
                        </div>
                    )}
                </div>

                <div className="relative">
                    <NuraSearchInput 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses or assignments..."
                        className="w-full"
                    />
                </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-grow min-h-0">
                <div className="max-h-[600px] overflow-y-auto pr-2 flex flex-col gap-4 
                                scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-[#DAEE49]
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-gray-200
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                hover:[&::-webkit-scrollbar-thumb]:bg-[#DAEE49]">
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            classId={classId}
                            course={course}
                            isAdmin={canUpdateCourse}
                            isLearner={isLearner}
                        />
                    ))}

                    {filteredAssignments.map((assignment) => (
                        <ProjectCard
                            key={assignment.id}
                            classId={classId}
                            assignment={assignment}
                            isAdmin={canUpdateCourse}
                            isLearner={isLearner}
                        />
                    ))}

                    {!hasResults && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-medium italic">
                                {searchQuery ? `No results found for "${searchQuery}"` : "No courses added yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
