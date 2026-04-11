"use client"

import { useEffect, useState, useRef } from "react"
import { Clock, ChevronLeft, ChevronRight, Download, FileText, X } from "lucide-react"
import { NuraButton } from "@/components/ui/button/button"
import { RichTextInput } from "@/components/ui/input/rich_text_input"
import FileUploadModal from "@/components/ui/modal/file_upload_modal"
import { ConfirmModal } from "@/components/ui/modal/confirmation_modal"
import { toast } from "sonner"

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
import TitleCard from "../ui/card/title_card"

type TestRunnerProps = {
  classId: string
  assignmentId: number
  enrollmentId?: number
  userName?: string
  objectiveQuestions: any[]
  essayQuestions: any[]
  projectQuestions: any[]
  testData: TestData
  pageText: PageText
  autoStart?: boolean
  finished?: boolean
  initialScore?: number
  feedback?: string
  isPlacement?: boolean
  assignmentType?: string
  problemUnderstanding?: number
  technicalAbility?: number
  solutionQuality?: number
  problemUnderstandingFeedback?: string
  technicalAbilityFeedback?: string
  solutionQualityFeedback?: string
  objectiveScore?: number
  maxObjectiveScore?: number
  essayScore?: number
  maxEssayScore?: number
  projectScore?: number
  maxProjectScore?: number
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
  feedback,
  isPlacement = false,
  assignmentType,
  problemUnderstanding,
  technicalAbility,
  solutionQuality,
  problemUnderstandingFeedback,
  technicalAbilityFeedback,
  solutionQualityFeedback,
  objectiveScore,
  maxObjectiveScore,
  essayScore,
  maxEssayScore,
  projectScore,
  maxProjectScore,
}: TestRunnerProps) {
  const STORAGE_KEY = `test_progress_${assignmentId}_${enrollmentId}`

  const [hasStarted, setHasStarted] = useState(autoStart)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isFinished, setIsFinished] = useState(finished)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false)
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

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined" || isFinished) return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setObjectiveAnswers(data.objectiveAnswers || {})
        setEssayAnswers(data.essayAnswers || {})
        setProjectAnswers(data.projectAnswers || {})

        if (data.startTime) {
          const savedStartTime = new Date(data.startTime)
          setStartTime(savedStartTime)
          setHasStarted(true)

          // Calculate remaining time
          const elapsedSeconds = Math.floor((new Date().getTime() - savedStartTime.getTime()) / 1000)
          const remaining = Math.max(0, (testData.durationMinutes * 60) - elapsedSeconds)
          setTimeLeft(remaining)
        }
      } catch (e) {
        console.error("Failed to load saved progress:", e)
      }
    }
  }, [isFinished, assignmentId, enrollmentId, testData.durationMinutes])

  // Save state to localStorage on changes
  useEffect(() => {
    if (typeof window === "undefined" || isFinished || !hasStarted) return

    const data = {
      objectiveAnswers,
      essayAnswers,
      projectAnswers,
      startTime: startTime?.toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [objectiveAnswers, essayAnswers, projectAnswers, startTime, hasStarted, isFinished])

  const handleStart = () => {
    const now = new Date()
    setHasStarted(true)
    setStartTime(now)

    // Also save immediately
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        objectiveAnswers: {},
        essayAnswers: {},
        projectAnswers: {},
        startTime: now.toISOString()
      }))
    }
  }

  const handleSubmitClick = () => {
    setIsModalOpen(true)
  }

  const cleanupStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const handleConfirmSubmit = async (isAutoSubmit: boolean = false) => {
    setIsSubmitting(true)
    setIsModalOpen(false)

    try {
      const formData = new FormData()
      formData.append("assignmentId", assignmentId.toString())
      if (enrollmentId) formData.append("enrollmentId", enrollmentId.toString())
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
        cleanupStorage()
        if (isAutoSubmit) {
          setIsTimeoutModalOpen(true)
        } else {
          window.location.reload()
        }
      } else {
        toast.error(response.error || "Failed to submit. Please try again.")
      }
    } catch (error) {
      console.error("error submitting:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isAutoSubmittingRef = useRef(false)

  useEffect(() => {
    if (!hasStarted || isFinished || testData.durationMinutes === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, isFinished, startTime, testData.durationMinutes])

  useEffect(() => {
    if (timeLeft === 0 && hasStarted && !isFinished && testData.durationMinutes > 0 && !isAutoSubmittingRef.current) {
      isAutoSubmittingRef.current = true
      handleConfirmSubmit(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, hasStarted, isFinished, testData.durationMinutes])

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
    } else if (currentType === "project") {
      setIsProjectUploadModalOpen(false)
      if (projectIndex < projectQuestions.length - 1) {
        setProjectIndex(projectIndex + 1)
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

  const renderSidebar = () => (
    <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
      {testData.durationMinutes > 0 && (
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
      )}

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
    <section className="min-w-0 flex-1">
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
        {currentObjective.options.map((opt: string, optIndex: number) => {
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
              <div dangerouslySetInnerHTML={{ __html: opt }} />
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
      <section className="min-w-0 flex-1">
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
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
              <span>Attached: {attachedFile.name}</span>
              <button
                type="button"
                onClick={() =>
                  setEssayFiles((prev) => {
                    const next = { ...prev }
                    delete next[currentEssay.id]
                    return next
                  })
                }
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
                aria-label="Remove attachment"
              >
                <X size={14} aria-hidden />
                Remove
              </button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const renderProjectContent = () => {
    if (!currentProject) return null
    const attachedFile = projectFiles[currentProject.id]
    return (
      <section className="min-w-0 flex-1">
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

        {((currentProject as any).attachments?.length > 0 || (currentProject as any).attachmentUrl) && (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Reference Documents</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {((currentProject as any).attachments || ((currentProject as any).attachmentUrl ? [(currentProject as any).attachmentUrl] : [])).map((url: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-blue-900 truncate max-w-[120px]">
                        {url.split('/').pop() || `Document ${idx+1}`}
                      </p>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#075546] text-white px-3 py-1.5 rounded-lg text-[10px] font-semibold hover:bg-[#0a6b58] transition-all"
                  >
                    <Download size={12} />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <ul className="list-none space-y-2 mb-6">
          {currentProject.requirements.map((req: string, index: number) => (
            <li key={index} className="text-sm text-gray-900 leading-relaxed">
              <span className="font-semibold">{String.fromCharCode(97 + index)}.</span>{" "}
              {req.split("\n").map((line: string, lineIndex: number) => (
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
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
              <span>Attached: {attachedFile.name}</span>
              <button
                type="button"
                onClick={() =>
                  setProjectFiles((prev) => {
                    const next = { ...prev }
                    delete next[currentProject.id]
                    return next
                  })
                }
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
                aria-label="Remove attachment"
              >
                <X size={14} aria-hidden />
                Remove
              </button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const renderTestCard = () => (
    <section className="mt-6 flex justify-center">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-8 md:px-12 md:py-10">
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
    <div className="max-w-7xl mx-auto mt-4">
      <TitleCard title={pageText.bannerTitle} />

      {isFinished ? (
        <FinishedCard
          classId={classId}
          assignmentId={assignmentId}
          enrollmentId={enrollmentId}
          testData={testData}
          pageText={pageText}
          userName={userName}
          totalScore={totalScore ?? undefined}
          feedback={feedback}
          problemUnderstanding={problemUnderstanding}
          technicalAbility={technicalAbility}
          solutionQuality={solutionQuality}
          problemUnderstandingFeedback={problemUnderstandingFeedback}
          technicalAbilityFeedback={technicalAbilityFeedback}
          solutionQualityFeedback={solutionQualityFeedback}
          isPlacement={isPlacement}
          objectiveScore={objectiveScore}
          maxObjectiveScore={maxObjectiveScore}
          essayScore={essayScore}
          maxEssayScore={maxEssayScore}
          projectScore={projectScore}
          maxProjectScore={maxProjectScore}
        />
      ) : hasStarted ? (
        renderTestCard()
      ) : (
        <IntroCard onStart={handleStart} testData={testData} pageText={pageText} />
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={() => handleConfirmSubmit(false)}
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

      <ConfirmModal
        isOpen={isTimeoutModalOpen}
        onConfirm={() => {
          setIsTimeoutModalOpen(false)
          if (assignmentType === "PROJECT") {
            window.location.href = `/classes/${classId}/feedback`
          } else {
            window.location.reload()
          }
        }}
        onCancel={() => {}}
        title="Waktu Habis"
        message="Waktu test telah habis, jawaban anda otomatis tersubmit"
        confirmText="Tutup"
        hideCancel={true}
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
        accept="Any"
        maxSizeMB={5}
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
        accept="Any"
        maxSizeMB={5}
        title="Attach File"
      />
    </div>
  )
}

