"use client"

import { use } from "react"
import { useSearchParams } from "next/navigation"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { TestRunner } from "@/components/test/test_runner"

import { OBJECTIVE_QUESTIONS, ESSAY_QUESTIONS, PROJECT_QUESTIONS, TEST_DATA, PAGE_TEXT } from "./constants"

export default function PlacementTestPage({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams()
  const skipIntro = searchParams.get("skipIntro") === "1"
  const isFinished = searchParams.get("finished") === "true"
  const resolvedParams = use(params)
  const classId = resolvedParams.id

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: PAGE_TEXT.breadcrumbHome, href: "/" },
            { label: TEST_DATA.courseName, href: `/classes/${classId}/overview` },
            { label: PAGE_TEXT.breadcrumbTest, href: `/classes/${classId}/test` },
          ]}
        />
      </div>

      <TestRunner
        classId={classId}
        objectiveQuestions={OBJECTIVE_QUESTIONS}
        essayQuestions={ESSAY_QUESTIONS}
        projectQuestions={PROJECT_QUESTIONS}
        testData={TEST_DATA}
        pageText={PAGE_TEXT}
        autoStart={skipIntro}
        finished={isFinished}
      />
    </main>
  )
}
