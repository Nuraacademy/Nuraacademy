import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import Link from "next/link";
import { getClassDetails } from "@/controllers/classController";
import { getEnrollmentStatus } from "@/controllers/enrollmentController";
import { redirect } from "next/navigation";

export default async function CourseOverviewPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // Mock user for now - in real app this comes from session
    const userId = "temp-user-123";

    const classDataRaw = await getClassDetails(id);
    if (!classDataRaw) {
        redirect("/classes");
    }

    const enrollment = await getEnrollmentStatus(userId, id);
    const isEnrolled = !!enrollment;
    const isTestFinished = false; // TBD: Check TestSubmission

    const formatDate = (date: Date) =>
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const imageUrl = classDataRaw.imageUrl || "https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp";

    return (
        <main className="min-h-screen bg-[#F5F5EC] font-sans text-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Class", href: "/classes" },
                            { label: classDataRaw.title, href: `/classes/${id}/overview` },
                        ]}
                    />
                </div>

                {/* Hero Card */}
                <section className="relative bg-gradient-to-r from-[#005954] to-[#94B546] rounded-[2rem] overflow-hidden mb-8 flex flex-col md:flex-row items-stretch gap-0">
                    {/* Image */}
                    <div className="w-full md:w-[280px] shrink-0">
                        <img
                            src={imageUrl}
                            alt="Course"
                            className="w-full h-full object-cover"
                            style={{ minHeight: "220px" }}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-grow p-8 text-white">
                        <h1 className="text-2xl font-bold mb-3">{classDataRaw.title}</h1>

                        {/* Hours & Modules */}
                        <div className="flex items-center gap-5 text-sm mb-5">
                            <div className="flex items-center gap-1.5">
                                <img
                                    src="/icons/ClockWhite.svg"
                                    alt="Clock"
                                    className="w-4 h-4"
                                />
                                <span>{classDataRaw.durationHours} hours</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <img
                                    src="/icons/Modules.svg"
                                    alt="Modules"
                                    className="w-4 h-4"
                                />
                                <span>{classDataRaw.courses.length} modules</span>
                            </div>
                        </div>

                        {/* Methods & Schedules */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm mb-5">
                            <div>
                                <p className="font-semibold text-white/80 mb-0.5">Methods</p>
                                <p>{classDataRaw.method}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white/80 mb-0.5">Schedules</p>
                                <p>{formatDate(classDataRaw.scheduleStart)} - {formatDate(classDataRaw.scheduleEnd)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-sm leading-relaxed text-white/90">
                            <p className="font-semibold text-white/80 mb-1">Description</p>
                            <p>{classDataRaw.description}</p>
                        </div>

                        {/* Enroll Button */}
                        {!isEnrolled && (
                            <div className="mt-5">
                                <Link href={`/classes/${id}/enrollment`}>
                                    <NuraButton
                                        label="Enroll Now"
                                        variant="primary"
                                        className="h-6 text-sm"
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Main Grid: Left + Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        {/* What You Will Learn */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4">What You Will Learn</h2>
                            <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-2">
                                {classDataRaw.learningPoints.map((item: any, i: number) => (
                                    <li key={i}>{item.text}</li>
                                ))}
                            </ol>
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">Timeline</h2>
                            </div>

                            {/* Timeline Items */}
                            <div className="relative pl-0">
                                {classDataRaw.classTimelines.map((item: any, index: number) => (
                                    <div key={item.id} className="relative flex items-center mb-6 last:mb-0">
                                        {/* Date */}
                                        <div className="w-24 text-xs text-gray-800 font-medium">
                                            {formatDate(item.date)}
                                        </div>

                                        {/* Indicator (Dot & Line) */}
                                        <div className="relative flex flex-col items-center mx-4">
                                            {/* Dot */}
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#D1D1D1] z-10 shrink-0"></div>

                                            {/* Line (except for last item) */}
                                            {index !== classDataRaw.classTimelines.length - 1 && (
                                                <div className="absolute top-2.5 w-[1px] h-9 bg-[#E5E5E5]"></div>
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="text-sm text-gray-800 font-medium">
                                            {item.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right Column */}
                    <section className="lg:col-span-8 flex flex-col gap-6">
                        {/* Placement Test */}
                        {isEnrolled && (
                            <div className="bg-[#1C3A37] rounded-[2rem] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                <div>
                                    <h2 className="text-lg text-white">Placement Test</h2>
                                    <p className="text-xs text-white">You must take the test first before starting this class. The test results are used to determine your group.</p>
                                </div>
                                {isTestFinished ? (
                                    <Link href={`/classes/${id}/test?finished=true`}>
                                        <NuraButton label="See Result" variant="primary" />
                                    </Link>
                                ) : (
                                    <Link href={`/classes/${id}/test`}>
                                        <NuraButton label="Start Test" variant="primary" />
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* Courses */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                <h2 className="text-xl font-bold">Courses</h2>
                            </div>

                            <div className="flex flex-col gap-4">
                                {classDataRaw.courses.map((course: any) => (
                                    <Link
                                        key={course.id}
                                        href={`/classes/${id}/course/${course.id}/overview`}
                                        className="border border-gray-200 rounded-[1.5rem] p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer block"
                                    >
                                        <h3 className="text-black text-medium mb-1">{course.title}</h3>
                                        <p className="text-sm text-gray-600">{course.description}</p>
                                    </Link>
                                ))}
                                {classDataRaw.courses.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No courses available yet.</p>
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}