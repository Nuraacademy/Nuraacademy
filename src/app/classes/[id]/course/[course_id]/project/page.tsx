import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"
import { getAssignmentByCourseId, getAssignmentResult } from "@/controllers/assignmentController"
import { getEnrollment } from "@/controllers/enrollmentController"
import { mapAssignmentToTestRunner } from "@/utils/test_mapper"
import { NotFoundState } from "@/components/ui/status/not_found_state"
import { getSession } from "@/app/actions/auth"
import { notFound } from "next/navigation"

export default async function ProjectSubmissionPage({
  params
}: {
  params: Promise<{ id: string, course_id: string }>
}) {
  const { id: classId, course_id: courseId } = await params
  
  const currentUserId = await getSession();
  const enrollment = currentUserId ? await getEnrollment(currentUserId, parseInt(classId)) : null;

  if (!enrollment) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
        <NotFoundState
          title="Enrollment Not Found"
          message="You must be enrolled in this class to view the project."
        />
      </main>
    )
  }

  const assignment = await getAssignmentByCourseId(parseInt(courseId))

  if (!assignment) {
      return notFound()
  }

  // Fetch score if finished
  let initialScore: number | undefined;
  const testResult = await getAssignmentResult(assignment.id, enrollment.id) as any;
  const isFinished = !!testResult;

  if (testResult) {
    initialScore = testResult.totalScore ?? undefined;
  }

  const {
    objectiveQuestions,
    essayQuestions,
    projectQuestions,
    testData,
    pageText
  } = mapAssignmentToTestRunner(assignment)

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: testData.courseName, href: `/classes/${classId}/overview` },
            { label: "Project", href: "#" },
          ]}
        />
      </div>

      <TestRunner
        classId={classId}
        assignmentId={assignment.id}
        enrollmentId={enrollment.id}
        userName={enrollment.user?.name || undefined}
        objectiveQuestions={objectiveQuestions}
        essayQuestions={essayQuestions}
        projectQuestions={projectQuestions}
        testData={{
          ...testData,
          courseName: testData.courseName || "Final Project",
          introDescription: "Please complete all task items for your final project. You can submit files and text for each task."
        }}
        pageText={{
            ...pageText,
            introTitle: "Final Project Submission",
        }}
        autoStart={false}
        finished={isFinished}
        initialScore={initialScore}
        isProject={true}
      />
    </main>
  )
}
