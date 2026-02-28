"use client"

import { NuraSelect } from "@/components/ui/input/nura_select";
import { NuraSearchInput } from "@/components/ui/input/nura_search_input";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { AssignmentCard } from "@/components/ui/card/assignment_card";
import { useState } from "react";

export default function AssignmentPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [assignmentType, setAssignmentType] = useState("");

    const assignments = [
        {
            classId: "1",
            courseId: "1",
            sessionId: "1",
            title: "Data Analytics Placement Test",
            tag: "Individual" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Placement" as const,
            className: "Class Name",
            courseName: "Course Name"
        },
        {

            title: "Data Analytics Pre-test",
            tag: "Individual" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Pre" as const,
            classId: "1",
            courseId: "1",
            sessionId: "1",
            className: "Class Name",
            courseName: "Course Name"
        },
        {
            title: "Data Analytics Post-test",
            tag: "Individual" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Post" as const,
            classId: "1",
            courseId: "1",
            sessionId: "1",
            className: "Class Name",
            courseName: "Course Name"
        },
        {
            title: "Python Assignment",
            tag: "Group" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Assignment" as const,
            classId: "1",
            courseId: "1",
            sessionId: "1",
            className: "Class Name",
            courseName: "Course Name"
        },
        {
            title: "Python Exercise",
            tag: "Individual" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Exercise" as const,
            classId: "1",
            courseId: "1",
            sessionId: "1",
            className: "Class Name",
            courseName: "Course Name"
        },
        {
            title: "Programming Final Project",
            tag: "Group" as const,
            className_name: "Class Name",
            course_name: "Course Name",
            type: "Final Project" as const,
            classId: "1",
            courseId: "1",
            sessionId: "1",
            className: "Class Name",
            courseName: "Course Name"
        }
    ];

    return (
        <main className={`relative min-h-screen w-full overflow-hidden py-4 px-4 md:py-8 md:pr-8 transition-all duration-300 ${isSidebarOpen ? "md:pl-80" : "md:pl-8"}`}>
            {/* Sidebar */}
            <Sidebar onOpenChange={setIsSidebarOpen} />

            {/* Background Image */}
            <img
                src="/background/PolygonBGTop.svg"
                alt="Background"
                className="absolute -z-10 h-[40rem] object-cover top-0 left-0"
            />
            <img
                src="/background/PolygonBGBot.svg"
                alt="Background"
                className="absolute -z-10 h-[40rem] object-cover bottom-0 right-0"
            />

            {/* Content */}
            <div className="text-black md:px-12 py-6 space-y-6 w-full max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold">
                    Assignments
                </h1>

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
                    {assignments.map((assignment, index) => (
                        <AssignmentCard
                            key={index}
                            title={assignment.title}
                            tag={assignment.tag}
                            classId={assignment.classId}
                            courseId={assignment.courseId}
                            sessionId={assignment.sessionId}
                            className={assignment.className}
                            courseName={assignment.courseName}
                            type={assignment.type}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
} 
