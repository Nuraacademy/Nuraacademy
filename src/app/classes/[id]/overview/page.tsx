import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb";
import { NuraButton } from "@/components/ui/button/button";
import { getClassById } from "@/controllers/classController";
import { getPlacementTestByClassId, getAssignmentResult, getProjectAssignmentsByClassId } from "@/controllers/assignmentController";
import { getEnrollment } from "@/controllers/enrollmentController";
import { getSession } from "@/app/actions/auth";
import { hasPermission } from "@/lib/rbac";
import { EnrollButton, AddTimelineButton, PlacementTestButton, AddAssignmentButton, AddCourseButton, CourseCard, ProjectCard, SuccessHandler, FeedbackButton, AnalyticsButton } from "./client_button";
import { notFound } from "next/navigation";
import { getFullSession } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";
import CourseListClient from "./CourseListClient";

export default async function CourseOverviewPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const currentUserId = await getSession();
    const canUpdateSchedule = await hasPermission('Class', 'UPDATE_SCHEDULE_CLASS');
    const canCreateCourse = await hasPermission('Course', 'CREATE_COURSE');
    const canUpdateCourse = await hasPermission('Course', 'UPDATE_COURSE');
    const canCreatePlacement = await hasPermission('Class', 'PLACEMENT_TEST_CREATE');
    const canViewFeedbackReport = await hasPermission('Feedback', 'VIEW_DETAIL_REFLECTION');
    const canViewClassAnalytics = await hasPermission('Analytics', 'ANALYTICS_REPORT_TRAINER');
    const canViewLearnerAnalytics = await hasPermission('Analytics', 'ANALYTICS_REPORT_LEARNER');
    const canEditClass = await hasPermission('Class', 'CREATE_UPDATE_CLASS');
    const canViewCurricula = await hasPermission('Class', 'SEARCH_VIEW_CURRICULA');

    const session = await getFullSession();
    const isLearner = !session || session.role === 'Learner';

    // Fetch live class data
    const classData = await getClassById(parseInt(id)) as any;
    if (!classData) {
        return notFound();
    }

    // Check if user is enrolled
    const enrollment = currentUserId ? await getEnrollment(currentUserId, parseInt(id)) : null;
    const isEnrolled = !!enrollment;

    // Fetch placement test
    const placementTest = await getPlacementTestByClassId(parseInt(id));

    // Check placement test status for enrolled students
    let isPlacementTestFinished = false;
    if (isEnrolled && enrollment && placementTest) {
        const testResult = await getAssignmentResult(placementTest.id, enrollment.id, false);
        isPlacementTestFinished = !!testResult?.finishedAt;
    }

    // Fetch PROJECT assignments for this class
    const projectAssignments = await getProjectAssignmentsByClassId(parseInt(id));

    // Fallback image if none provided
    const imageUrl = classData.imgUrl || "https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp";

    return (
        <main className="min-h-screen bg-[#F5F5EC]  text-gray-800">
            <SuccessHandler
                classId={id}
                timelines={classData.timelines || []}
                startDate={classData.startDate}
                endDate={classData.endDate}
            />
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb
                        items={[
                            { label: "Home", href: "/classes" },
                            { label: classData.title, href: `/classes/${id}/overview` },
                        ]}
                    />
                </div>

                {/* Hero Card */}
                <section className="relative bg-gradient-to-r from-[#005954] via-[#005954] to-[#94B546] rounded-4xl overflow-hidden mb-8 flex flex-col md:flex-row items-stretch gap-0">
                    {/* Image */}
                    <div className="relative w-full md:w-[382px] lg:w-[382px] shrink-0 aspect-[382/216] md:aspect-auto mx-4 my-4">
                        <Image
                            src={imageUrl}
                            alt={classData.title}
                            className="rounded-4xl object-cover w-full h-full border border-white/10"
                            width={382}
                            height={216}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-grow p-8 text-white">
                        <h1 className="text-lg font-medium mb-3">{classData.title}</h1>

                        {/* Hours & Modules */}
                        <div className="flex items-center gap-5 text-xs mb-5">
                            <div className="flex items-center gap-1.5">
                                <Image
                                    src="/icons/ClockWhite.svg"
                                    alt="Clock"
                                    width={16}
                                    height={16}
                                />
                                <span>{classData.hours} hours</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Image
                                    src="/icons/ModulesWhite.svg"
                                    alt="Modules"
                                    width={16}
                                    height={16}
                                />
                                <span>{classData.courses?.length || 0} modules</span>
                            </div>
                        </div>

                        {/* Methods & Schedules */}
                        <div className="flex gap-x-16 gap-y-1 text-xs mb-5">
                            <div>
                                <p className="text-sm mb-0.5">Methods</p>
                                <div dangerouslySetInnerHTML={{ __html: classData.methods }} />
                            </div>
                            <div>
                                <p className="text-sm mb-0.5">Schedules</p>
                                <p>{classData.startDate ? new Date(classData.startDate).toLocaleDateString() : 'TBA'} - {classData.endDate ? new Date(classData.endDate).toLocaleDateString() : 'TBA'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-xs leading-relaxed text-white/90">
                            <p className="text-sm mb-1">Description</p>
                            <div dangerouslySetInnerHTML={{ __html: classData.description }} />
                        </div>

                        {/* Enroll Button */}
                        {(!isEnrolled && isLearner) && (
                            <div className="mt-5">
                                <EnrollButton classId={id} />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {canEditClass && (
                        <div className="flex justify-center mt-6 mr-6 gap-4 top-0">
                            <Link href={`/classes/${id}/enrollments`} title="View Enrollments">
                                <Image src="/icons/People.svg" alt="Enrollments" width={16} height={16} />
                            </Link>
                            <Link href={`/classes/${id}/edit`} title="Edit Class">
                                <Image src="/icons/Edit.svg" alt="Edit" width={16} height={16} />
                            </Link>
                        </div>
                    )}
                </section>

                {/* Main Grid: Left + Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        {/* What You Will Learn */}
                        {classData.learningObjective && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-md mb-6">What You Will Learn</h2>
                                <div className="text-xs" dangerouslySetInnerHTML={{ __html: classData.learningObjective }} />
                            </div>
                        )}

                        {/* Timeline Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-md">Timeline</h2>
                                {canUpdateSchedule && (
                                    <AddTimelineButton classId={id} isEdit={classData.timelines?.length > 0} />
                                )}
                            </div>

                            {/* Timeline Items */}
                            <div className="relative">
                                {classData.timelines?.map((item, index) => (
                                    <div key={item.id} className="relative flex items-center mb-6 last:mb-0">
                                        {/* Date */}
                                        <div className="w-24 text-xs whitespace-pre-wrap">
                                            {item.date ? new Date(item.date).toLocaleDateString() : 'TBA'}
                                        </div>

                                        {/* Indicator (Dot & Line) */}
                                        <div className="relative flex flex-col items-center mx-4">
                                            {/* Dot */}
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#D1D1D1] z-10 shrink-0"></div>

                                            {/* Line (except for last item) */}
                                            {index !== classData.timelines.length - 1 && (
                                                <div className="absolute top-2.5 w-[1px] h-9 bg-[#E5E5E5]"></div>
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="text-xs">
                                            {item.activity}
                                        </div>
                                    </div>
                                ))}
                                {(!classData.timelines || classData.timelines.length === 0) && (
                                    <p className="text-xs italic">No timeline available.</p>
                                )}
                            </div>
                        </div>

                        {/* Instructor & Trainer Section */}
                        {(() => {
                            const trainersMap = new Map();
                            if (classData.trainer) {
                                trainersMap.set(classData.trainer.id, { ...classData.trainer, isMain: true });
                            }
                            classData.courses?.forEach((course: any) => {
                                if (course.user) {
                                    trainersMap.set(course.user.id, course.user);
                                }
                                course.sessions?.forEach((session: any) => {
                                    if (session.user) {
                                        trainersMap.set(session.user.id, session.user);
                                    }
                                });
                            });
                            const trainers = Array.from(trainersMap.values());

                            if (trainers.length === 0) return null;

                            return (
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-md mb-6">Instructor & Trainer</h2>
                                    <div className="space-y-6">
                                        {trainers.map((trainer, idx) => (
                                            <div key={trainer.id}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                        <Image
                                                            src={`/example/human.png`}
                                                            alt={trainer.name || trainer.username}
                                                            className="w-full h-full object-cover"
                                                            width={48}
                                                            height={48}
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm text-[#1C3A37]">{trainer.name || trainer.username}</h4>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{trainer.role?.name || "Instructor"}</p>
                                                    </div>
                                                    {/* Learner: Give Feedback */}
                                                    {isLearner && isEnrolled && (
                                                        <Link href={`/feedback/trainer/${trainer.id}?classId=${classData.id}`} className="bg-[#DAEE49] p-2 rounded-xl hover:bg-[#C9D942] transition-colors shadow-sm" title="Give Feedback">
                                                            <Image src="/icons/Information.svg" alt="Feedback" width={16} height={16} />
                                                        </Link>
                                                    )}

                                                    {/* Trainer/Admin: View Analytics */}
                                                    {!isLearner && (canViewClassAnalytics || currentUserId === trainer.id) && (
                                                        <Link href={`/classes/${id}/analytics/trainer?trainerId=${trainer.id}`} className="bg-[#DAEE49]/20 p-2 rounded-xl hover:bg-[#DAEE49]/40 border border-[#DAEE49]/50 transition-colors shadow-sm" title="View Report">
                                                            <Image src="/icons/Information.svg" alt="Analytics" width={16} height={16} />
                                                        </Link>
                                                    )}
                                                </div>
                                                {idx < trainers.length - 1 && (
                                                    <div className="h-[1px] bg-gray-50 w-full mt-6" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Feedback & Analytics Buttons */}
                        <div className="flex flex-col gap-3">
                            {((isLearner && isEnrolled) || (!isLearner && canViewFeedbackReport)) && (
                                <FeedbackButton classId={id} isLearner={isLearner} />
                            )}
                            {((isLearner && isEnrolled) || (!isLearner && (canViewClassAnalytics || canViewLearnerAnalytics))) && (
                                <AnalyticsButton
                                    classId={id}
                                    isLearner={isLearner}
                                    canViewClassAnalytics={canViewClassAnalytics}
                                    canViewLearnerAnalytics={canViewLearnerAnalytics}
                                />
                            )}
                            {canViewCurricula && classData.curricula?.length > 0 && (
                                <div className="flex flex-col gap-3">
                                    {classData.curricula.map((cur: any) => (
                                        <NuraButton
                                            key={cur.id}
                                            label={classData.curricula.length > 1 ? `View Curricula: ${cur.title}` : "View Curricula"}
                                            href={`/curricula/${cur.id}`}
                                            leftIcon={<Image src="/icons/Curricula.svg" alt="Curricula" width={20} height={20} />}
                                            variant="primary"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Column */}
                    <section className="lg:col-span-8 flex flex-col gap-6 h-full">
                        {/* Placement Test */}
                        {(isEnrolled || canCreatePlacement) && (
                            <div className="bg-[#1C3A37] rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                <div>
                                    <h2 className="text-md mb-4 text-white">Placement Test</h2>
                                    <p className="text-xs text-white">You must take the test first before starting this class. The test results are used to determine your group.</p>
                                </div>
                                <PlacementTestButton
                                    classId={id}
                                    isAdmin={canCreatePlacement}
                                    isFinished={isPlacementTestFinished}
                                    courseCount={classData.courses?.length || 0}
                                    startDate={placementTest?.startDate || undefined}
                                    endDate={placementTest?.endDate || undefined}
                                />
                            </div>
                        )}

                        {/* Courses & Curriculum (Client-side Searchable & Scrollable) */}
                        <div className="flex-grow flex flex-col min-h-0">
                            <CourseListClient
                                classId={id}
                                initialCourses={classData.courses || []}
                                projectAssignments={projectAssignments || []}
                                curricula={classData.curricula || []}
                                canCreateCourse={canCreateCourse}
                                canUpdateCourse={canUpdateCourse}
                                canViewCurricula={canViewCurricula}
                                isLearner={isLearner}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}