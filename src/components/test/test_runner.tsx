"use client"

import { useEffect, useState } from "react"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { NuraButton } from "@/components/ui/button/button"
import { RichTextInput } from "@/components/ui/input/rich_text_input"
import FileUploadModal from "@/components/ui/modal/file_upload_modal"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"

import { IntroCard } from "@/app/classes/[id]/test/components/intro_card"
import { FinishedCard } from "@/app/classes/[id]/test/components/finished_card"
import {
  ObjectiveQuestion,
  EssayQuestion,
  ProjectQuestion,
  QuestionType,
  TestData,
  PageText
} from "@/app/classes/[id]/test/types"
import { submitTest } from "@/app/actions/assignment"

type TestRunnerProps = {
  classId: string
  assignmentId: number
  enrollmentId: number
  objectiveQuestions: ObjectiveQuestion[]
  essayQuestions: EssayQuestion[]
  projectQuestions: ProjectQuestion[]
  testData: TestData
  pageText: PageText
  userName?: string
  autoStart?: boolean
  finished?: boolean
  initialScore?: number
  showBanner?: boolean
}

export function TestRunner({
  classId,
  assignmentId,
  enrollmentId,
  objectiveQuestions,
  essayQuestions,
  projectQuestions,
  testData,
  pageText,
  userName,
  autoStart = false,
  finished = false,
  initialScore,
  showBanner = true,
}: TestRunnerProps) {
  const [hasStarted, setHasStarted] = useState(autoStart)
  const [startTime, setStartTime] = useState<Date | null>(autoStart ? new Date() : null)
  const [isFinished, setIsFinished] = useState(finished)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalScore, setTotalScore] = useState<number | null>(initialScore ?? null)
  const [timeLeft, setTimeLeft] = useState(testData.durationMinutes * 60)
  const [currentType, setCurrentType] = useState<QuestionType>(
    objectiveQuestions.length > 0 ? "objective" :
      essayQuestions.length > 0 ? "essay" : "project"
  )
  const [objectiveIndex, setObjectiveIndex] = useState(0)
  const [essayIndex, setEssayIndex] = useState(0)
  const [projectIndex, setProjectIndex] = useState(0)
  const [objectiveAnswers, setObjectiveAnswers] = useState<Record<number, string>>({})
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({})
  const [essayFiles, setEssayFiles] = useState<Record<number, File | null>>({})
  const [projectAnswers, setProjectAnswers] = useState<Record<number, string>>({})
  const [projectFiles, setProjectFiles] = useState<Record<number, File | null>>({})
  const [isEssayUploadModalOpen, setIsEssayUploadModalOpen] = useState(false)
  const [isProjectUploadModalOpen, setIsProjectUploadModalOpen] = useState(false)

  const currentObjective = objectiveQuestions[objectiveIndex]
  const currentEssay = essayQuestions[essayIndex]
  const currentProject = projectQuestions[projectIndex]

  const handleStart = () => {
    setHasStarted(true)
    setStartTime(new Date())
  }

  const handleSubmitClick = () => {
    setIsModalOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("assignmentId", assignmentId.toString())
      formData.append("enrollmentId", enrollmentId.toString())
      formData.append("classId", classId)
      formData.append("startedAt", (startTime || new Date()).toISOString())

      // Objective answers
      Object.entries(objectiveAnswers).forEach(([id, value]) => {
        formData.append(`objective_${id}`, value)
      })

      // Essay answers
      Object.entries(essayAnswers).forEach(([id, value]) => {
        formData.append(`essay_text_${id}`, value)
      })
      Object.entries(essayFiles).forEach(([id, file]) => {
        if (file) formData.append(`essay_file_${id}`, file)
      })

      // Project answers
      Object.entries(projectAnswers).forEach(([id, value]) => {
        formData.append(`project_text_${id}`, value)
      })
      Object.entries(projectFiles).forEach(([id, file]) => {
        if (file) formData.append(`project_file_${id}`, file)
      })

      const response = await submitTest(formData)

      if (response.success) {
        setIsModalOpen(false)
        window.location.href = window.location.pathname + "?finished=true"
      } else {
        alert(response.error || "Failed to submit. Please try again.")
      }
    } catch (error) {
      console.error("error submitting:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!hasStarted || isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleConfirmSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, isFinished])

  const getUnansweredCount = () => {
    let count = 0
    count += objectiveQuestions.length - Object.keys(objectiveAnswers).length
    count +=
      essayQuestions.length -
      essayQuestions.filter((q) => {
        const hasText = (essayAnswers[q.id] || "").replace(/<[^>]+>/g, "").trim().length > 0
        const hasFile = !!essayFiles[q.id]
        return hasText || hasFile
      }).length
    count +=
      projectQuestions.length -
      Object.keys(projectFiles).filter((key) => projectFiles[Number(key)] !== null).length
    return count
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const pad = (num: number) => num.toString().padStart(2, "0")
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
    return `${pad(m)}:${pad(s)}`
  }

  const handleNext = () => {
    if (currentType === "objective") {
      if (objectiveIndex < objectiveQuestions.length - 1) {
        setObjectiveIndex(objectiveIndex + 1)
      } else if (essayQuestions.length > 0) {
        setCurrentType("essay")
        setEssayIndex(0)
      } else if (projectQuestions.length > 0) {
        setCurrentType("project")
        setProjectIndex(0)
      }
    } else if (currentType === "essay") {
      setIsEssayUploadModalOpen(false)
      if (essayIndex < essayQuestions.length - 1) {
        setEssayIndex(essayIndex + 1)
      } else if (projectQuestions.length > 0) {
        setCurrentType("project")
        setProjectIndex(0)
        setIsProjectUploadModalOpen(false)
      }
    }
  }

  const handlePrev = () => {
    if (currentType === "project") {
      setIsProjectUploadModalOpen(false)
      if (projectIndex > 0) {
        setProjectIndex(projectIndex - 1)
      } else if (essayQuestions.length > 0) {
        setCurrentType("essay")
        setEssayIndex(essayQuestions.length - 1)
      } else if (objectiveQuestions.length > 0) {
        setCurrentType("objective")
        setObjectiveIndex(objectiveQuestions.length - 1)
      }
    } else if (currentType === "essay") {
      setIsEssayUploadModalOpen(false)
      if (essayIndex > 0) {
        setEssayIndex(essayIndex - 1)
      } else if (objectiveQuestions.length > 0) {
        setCurrentType("objective")
        setObjectiveIndex(objectiveQuestions.length - 1)
      }
    } else if (currentType === "objective") {
      if (objectiveIndex > 0) setObjectiveIndex(objectiveIndex - 1)
    }
  }

  const renderBanner = () => (
    <div className="px-6 mt-2">
      <div className="w-full bg-[#075546] text-white py-4 px-8 rounded-[1.5rem] shadow-sm">
        <h1 className="text-lg font-semibold">{pageText.bannerTitle}</h1>
      </div>
    </div>
  )

  const renderSidebar = () => (
    <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.sidebarTimeLeft}</p>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
        >
          <Clock size={14} className={timeLeft < 300 ? "text-red-600" : "text-emerald-600"} />
          <span className="font-medium tracking-wide">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.sidebarObjective}</p>
        <div className="grid grid-cols-5 gap-2">
          {objectiveQuestions.map((q, index) => {
            const isActive = currentType === "objective" && objectiveIndex === index
            const isAnswered = !!objectiveAnswers[q.id]

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentType("objective")
                  setObjectiveIndex(index)
                }}
                className={`w-8 h-8 rounded-md text-xs flex items-center justify-center border transition-colors ${isActive
                  ? "bg-[#075546] text-white border-[#075546]"
                  : isAnswered
                    ? "bg-emerald-50 text-[#075546] border-emerald-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                  }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.sidebarEssay}</p>
        <div className="grid grid-cols-5 gap-2">
          {essayQuestions.map((q, index) => {
            const isActive = currentType === "essay" && essayIndex === index
            const val = essayAnswers[q.id] || ""
            const hasText = val.replace(/<[^>]+>/g, "").trim().length > 0
            const hasFile = !!essayFiles[q.id]
            const isAnswered = hasText || hasFile
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentType("essay")
                  setEssayIndex(index)
                }}
                className={`w-8 h-8 rounded-md text-xs flex items-center justify-center border transition-colors ${isActive
                  ? "bg-[#075546] text-white border-[#075546]"
                  : isAnswered
                    ? "bg-emerald-50 text-[#075546] border-emerald-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                  }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.sidebarProject}</p>
        <div className="flex flex-wrap gap-2">
          {projectQuestions.map((q, index) => {
            const isActive = currentType === "project" && projectIndex === index
            const isAnswered = !!projectFiles[q.id]
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentType("project")
                  setProjectIndex(index)
                }}
                className={`w-8 h-8 rounded-md text-xs flex items-center justify-center border transition-colors ${isActive
                  ? "bg-[#075546] text-white border-[#075546]"
                  : isAnswered
                    ? "bg-emerald-50 text-[#075546] border-emerald-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                  }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )

  const renderObjectiveContent = () => (
    <section className="flex-1">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
        <span className="font-semibold">{pageText.contentObjective}</span>
        <span>
          {pageText.contentQuestions} {objectiveIndex + 1} {pageText.contentOf}{" "}
          {objectiveQuestions.length}
        </span>
        <span className="font-semibold">
          {currentObjective.points} {pageText.contentPoints}
        </span>
      </div>

      <div
        className="text-sm text-gray-900 mb-6 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: currentObjective.question }}
      />

      <div className="space-y-3">
        {currentObjective.options.map((opt, optIndex) => {
          const isSelected = objectiveAnswers[currentObjective.id] === opt
          return (
            <button
              key={optIndex}
              type="button"
              onClick={() =>
                setObjectiveAnswers((prev) => ({ ...prev, [currentObjective.id]: opt }))
              }
              className={`w-full text-left text-sm rounded-xl px-4 py-3 border transition-colors ${isSelected
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200"
                }`}
            >
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </button>
          )
        })}
      </div>
    </section>
  )

  const renderEssayContent = () => {
    if (!currentEssay) return null
    const attachedFile = essayFiles[currentEssay.id]
    return (
      <section className="flex-1">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
          <span className="font-semibold">{pageText.contentEssay}</span>
          <span>
            {pageText.contentQuestions} {essayIndex + 1} {pageText.contentOf}{" "}
            {essayQuestions.length}
          </span>
          <span className="font-semibold">
            {currentEssay.points} {pageText.contentPoints}
          </span>
        </div>

        <div
          className="text-sm text-gray-900 mb-4 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: currentEssay.question }}
        />

        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.contentAnswer}</p>

        <RichTextInput
          value={essayAnswers[currentEssay.id] ?? ""}
          onChange={(val) =>
            setEssayAnswers((prev) => ({
              ...prev,
              [currentEssay.id]: val,
            }))
          }
        />

        <div className="mt-4">
          <NuraButton
            label="Attach File"
            variant="primary"
            type="button"
            className="min-w-[160px]"
            onClick={() => setIsEssayUploadModalOpen(true)}
          />
          {attachedFile && (
            <p className="text-xs text-gray-600 mt-2">Attached: {attachedFile.name}</p>
          )}
        </div>
      </section>
    )
  }

  const renderProjectContent = () => {
    if (!currentProject) return null
    const attachedFile = projectFiles[currentProject.id]
    return (
      <section className="flex-1">
        <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
          <span className="font-semibold">{pageText.contentProject}</span>
          <span>
            {pageText.contentQuestions} {projectIndex + 1} {pageText.contentOf}{" "}
            {projectQuestions.length}
          </span>
          <span className="font-semibold">
            {currentProject.points} {pageText.contentPoints}
          </span>
        </div>

        <div
          className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: currentProject.question }}
        />

        <ul className="list-none space-y-2 mb-6">
          {currentProject.requirements.map((req, index) => (
            <li key={index} className="text-sm text-gray-900 leading-relaxed">
              <span className="font-semibold">{String.fromCharCode(97 + index)}.</span>{" "}
              {req.split("\n").map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {line.trim().startsWith("•") ? (
                    <span className="ml-4">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </li>
          ))}
        </ul>

        <p className="text-xs font-semibold text-gray-700 mb-2">{pageText.contentAnswer}</p>

        <RichTextInput
          value={projectAnswers[currentProject.id] ?? ""}
          onChange={(val) =>
            setProjectAnswers((prev) => ({
              ...prev,
              [currentProject.id]: val,
            }))
          }
        />

        <div className="mt-4">
          <NuraButton
            label="Attach File"
            variant="primary"
            type="button"
            className="min-w-[160px]"
            onClick={() => setIsProjectUploadModalOpen(true)}
          />
          {attachedFile && (
            <p className="text-xs text-gray-600 mt-2">Attached: {attachedFile.name}</p>
          )}
        </div>
      </section>
    )
  }

  const renderTestCard = () => (
    <section className="mt-6 flex justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-8 py-8 md:px-12 md:py-10">
        <div className="flex flex-col md:flex-row">
          {renderSidebar()}
          {currentType === "objective"
            ? renderObjectiveContent()
            : currentType === "essay"
              ? renderEssayContent()
              : renderProjectContent()}
        </div>

        <div className="mt-10 flex justify-between items-center text-sm text-gray-800">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-2 text-sm text-gray-800 hover:underline"
          >
            <span className="w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center">
              <ChevronLeft size={16} />
            </span>
            {pageText.testPrevButton}
          </button>

          {(currentType === "project" && projectIndex === projectQuestions.length - 1) ||
            (currentType === "essay" && essayIndex === essayQuestions.length - 1 && projectQuestions.length === 0) ||
            (currentType === "objective" && objectiveIndex === objectiveQuestions.length - 1 && essayQuestions.length === 0 && projectQuestions.length === 0) ? (
            <NuraButton
              label={pageText.buttonSubmit}
              variant="primary"
              type="button"
              className="max-w-[140px]"
              onClick={handleSubmitClick}
            />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 text-sm text-gray-800 hover:underline"
            >
              {pageText.testNextButton}
              <span className="w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center">
                <ChevronRight size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )

  return (
    <div className="px-6 pb-10">
      {showBanner && renderBanner()}

      {isFinished ? (
        <FinishedCard
          classId={classId}
          testData={testData}
          pageText={pageText}
          userName={userName}
          totalScore={totalScore ?? undefined}
        />
      ) : hasStarted ? (
        renderTestCard()
      ) : (
        <IntroCard onStart={handleStart} testData={testData} pageText={pageText} />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
        onCancel={() => setIsModalOpen(false)}
        title="Submit Test?"
        message={
          getUnansweredCount() > 0
            ? `You still have unanswered question(s). Are you sure you want to submit?`
            : "Are you sure you want to submit your test? You cannot undo this action."
        }
        confirmText="Submit Test"
        cancelText="Cancel"
      />

      <FileUploadModal
        isOpen={isEssayUploadModalOpen}
        onClose={() => setIsEssayUploadModalOpen(false)}
        onUploadSuccess={(file) =>
          setEssayFiles((prev) => ({
            ...prev,
            [currentEssay.id]: file,
          }))
        }
        accept=".pdf"
        maxSizeMB={5}
        supportedFileType=".pdf"
        title="Attach File"
      />

      <FileUploadModal
        isOpen={isProjectUploadModalOpen}
        onClose={() => setIsProjectUploadModalOpen(false)}
        onUploadSuccess={(file) =>
          setProjectFiles((prev) => ({
            ...prev,
            [currentProject.id]: file,
          }))
        }
        accept=".pdf"
        maxSizeMB={5}
        supportedFileType=".pdf"
        title="Attach File"
      />
    </div>
  )
}

