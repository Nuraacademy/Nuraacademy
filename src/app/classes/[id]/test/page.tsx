import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"
import { getPlacementTestByClassId } from "@/controllers/assignmentController"
import { getEnrollment } from "@/controllers/enrollmentController"
import { mapAssignmentToTestRunner } from "@/utils/test_mapper"
import { NotFoundState } from "@/components/ui/status/not_found_state"

export default async function PlacementTestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ skipIntro?: string, finished?: string }>
}) {
  const { id: classId } = await params
  const { skipIntro, finished } = await searchParams

  const assignment = await getPlacementTestByClassId(parseInt(classId))

  // For now, we assume userId = 1 if not authenticated
  // In a real app, get this from session
  const enrollment = await getEnrollment(1, parseInt(classId))

  if (!assignment || !enrollment) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9F0] flex items-center justify-center">
        <NotFoundState
          title={!assignment ? "Placement Test Not Available" : "Enrollment Not Found"}
          message={!assignment
            ? "It looks like there is no placement test available for this class yet. Please contact your instructor for more information."
            : "You must be enrolled in this class to take the placement test."
          }
        />
      </main>
    )
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
            { label: pageText.breadcrumbHome, href: "/" },
            { label: testData.courseName, href: `/classes/${classId}/overview` },
            { label: pageText.breadcrumbTest, href: `/classes/${classId}/test` },
          ]}
        />
      </div>

      <TestRunner
        classId={classId}
        assignmentId={assignment.id}
        enrollmentId={enrollment.id}
        objectiveQuestions={objectiveQuestions}
        essayQuestions={essayQuestions}
        projectQuestions={projectQuestions}
        testData={testData}
        pageText={pageText}
        autoStart={skipIntro === "1"}
        finished={finished === "true"}
      />
    </main>
  )
}
