"use client"

import { use, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"
import { fetchTestDataAction } from "./actions"
import { toast } from "sonner"
import { PAGE_TEXT, TEST_DATA } from "./constants"

export default function PlacementTestPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams()
  const skipIntro = searchParams.get("skipIntro") === "1"
  const isFinishedDefault = searchParams.get("finished") === "true"
  const resolvedParams = use(params)
  const classId = resolvedParams.id

  const [isLoading, setIsLoading] = useState(true)
  const [testId, setTestId] = useState("")
  const [questions, setQuestions] = useState({
    objective: [],
    essay: [],
    project: []
  })
  const [duration, setDuration] = useState(60)
  const [courseName, setCourseName] = useState(TEST_DATA.courseName)

  useEffect(() => {
    const loadTest = async () => {
      setIsLoading(true)
      const result = await fetchTestDataAction(classId)
      if (result.success && result.testData && result.questions) {
        setQuestions(result.questions as any)
        setDuration(result.testData.durationMinutes)
        setTestId(result.testId || "")
        setCourseName(result.courseName || TEST_DATA.courseName)
      } else {
        toast.error(result.error || "Failed to load test")
      }
      setIsLoading(false)
    }
    loadTest()
  }, [classId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#075546]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: PAGE_TEXT.breadcrumbHome, href: "/" },
            { label: courseName, href: `/classes/${classId}/overview` },
            { label: PAGE_TEXT.breadcrumbTest, href: `/classes/${classId}/test` },
          ]}
        />
      </div>

      <TestRunner
        classId={classId}
        testId={testId}
        objectiveQuestions={questions.objective}
        essayQuestions={questions.essay}
        projectQuestions={questions.project}
        testData={{ ...TEST_DATA, durationMinutes: duration }}
        pageText={PAGE_TEXT}
        autoStart={skipIntro}
        finished={isFinishedDefault}
      />
    </main>
  )
}

