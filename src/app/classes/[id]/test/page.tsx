"use client"

import { useEffect, useState } from "react"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Breadcrumb from "@/components/ui/breadcrumb/breadcrumb"
import { NuraButton } from "@/components/ui/button/button"
import { RichTextInput } from "@/components/ui/input/rich_text_input"
import FileUpload from "@/components/ui/upload/file_upload"

type QuestionType = "objective" | "essay" | "project"

interface ObjectiveQuestion {
  id: number
  question: string
  options: string[]
  points: number
}

interface EssayQuestion {
  id: number
  question: string
  points: number
}

interface ProjectQuestion {
  id: number
  question: string
  requirements: string[]
  points: number
}

const OBJECTIVE_QUESTIONS: ObjectiveQuestion[] = Array.from({ length: 15 }).map(
  (_, index) => ({
    id: index + 1,
    question:
      "Proses pengumpulan data dari berbagai sumber sebelum disimpan dalam sistem big data disebut ...",
    options: ["A. Data Visualization", "B. Data Ingestion", "C. Data Modeling", "D. Data Reporting"],
    points: 10,
  }),
)

const ESSAY_QUESTIONS: EssayQuestion[] = Array.from({ length: 5 }).map((_, index) => ({
  id: index + 1,
  question:
    "Bandingkan perbedaan antara structured, semi-structured, dan unstructured data. Jelaskan ciri masing-masing, contoh di sekitar anda, tantangan dalam pengolahannya.",
  points: 20,
}))

const PROJECT_QUESTIONS: ProjectQuestion[] = [
  {
    id: 1,
    question: "Buat program Python yang:",
    requirements: [
      "Membaca file transaksi (.csv)",
      "Menggunakan variable untuk menyimpan parameter (misalnya diskon)",
      "Menggunakan selection statement untuk menentukan kategori transaksi:\n  • < 100.000 = Low\n  • 100.000-500.000 = Medium\n  • > 500.000 = High",
      "Menggunakan looping untuk menghitung total transaksi",
      "Membuat function yang:\n  • Menghitung total belanja\n  • Menghitung diskon\n  • Menyimpan hasil ke file baru (output.csv)",
    ],
    points: 50,
  },
]

const PAGE_CONTENT = {
  bannerTitle: "Placement Test",
  introTitle: "Hello, Learner!",
  introDescription:
    "Selamat datang di tahap awal perjalanan belajarmu. Hasil placement test ini membantu kami menentukan course yang bisa kamu lewati serta menempatkanmu dalam grup belajar sesuai materi yang perlu kamu pelajari. Jangan tegang dan lakukan yang terbaik!",
  infoTitle: "Detail Informasi Tes",
  durationLabel: "Duration:",
  durationValue: "120 minutes",
  sectionLabel: "Section:",
  sectionValue: "3 sections",
  deadlineLabel: "Deadline:",
  deadlineValue: "7 Maret 2026",
  testDescription:
    "Tes ini mengukur pemahaman dasar pemrograman untuk data analytics, termasuk konsep dasar cara kerja programming, penggunaan variabel dengan python, pengolahan data melalui file, penerapan selection dan looping statement, pembuatan fungsi (function), serta pengolahan array dan dataframe.",
  instructionTitle: "Instruksi",
  instructions: [
    "Pastikan koneksi internet stabil selama pengerjaan.",
    "Tes hanya dapat dilakukan satu kali, pastikan kamu memiliki waktu luang yang cukup.",
    "Dilarang menggunakan alat bantu AI atau mencari jawaban di luar platform selama tes berlangsung.",
    "Hasil penempatan grup akan diumumkan sehari setelah batas akhir pengisian tes.",
  ],
  buttonCancel: "Cancel",
  buttonStart: "Start",
  durationMinutes: 120,
  sidebarTimeLeft: "Time Left",
  sidebarObjective: "Objective Answer",
  buttonSubmit: "Submit Test",
  finishedTitle: "Test Submitted!",
  finishedDescription: "Thank you for completing the placement test. Your answers have been recorded. We will review your results and assign you to the appropriate group.",
  buttonBackToCourse: "Back to Course Overview",
  sidebarEssay: "Essay Answer",
  sidebarProject: "Project Answer",
  contentObjective: "Objective",
  contentEssay: "Essay",
  contentProject: "Project",
  contentQuestions: "Questions",
  contentOf: "of",
  contentPoints: "points",
  contentAnswer: "Answer",
  testPrevButton: "Previous questions",
  testNextButton: "Next questions",
  breadcrumbHome: "Home",
  breadcrumbCourse: "Foundation to Data Analytics",
  breadcrumbTest: "Placement Test",
}

export default function PlacementTestPage({ params }: { params: Promise<{ id: string }> }) {
  const [hasStarted, setHasStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(PAGE_CONTENT.durationMinutes * 60)
  const [currentType, setCurrentType] = useState<QuestionType>("objective")
  const [objectiveIndex, setObjectiveIndex] = useState(0)
  const [essayIndex, setEssayIndex] = useState(0)
  const [projectIndex, setProjectIndex] = useState(0)
  const [objectiveAnswers, setObjectiveAnswers] = useState<Record<number, string>>({})
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({})
  const [projectFiles, setProjectFiles] = useState<Record<number, File | null>>({})

  const currentObjective = OBJECTIVE_QUESTIONS[objectiveIndex]
  const currentEssay = ESSAY_QUESTIONS[essayIndex]
  const currentProject = PROJECT_QUESTIONS[projectIndex]

  const [classId, setClassId] = useState<string>("")

  useEffect(() => {
    params.then(p => setClassId(p.id)).catch(() => { })
  }, [params])

  const handleSubmit = () => {
    setIsFinished(true)
  }

  useEffect(() => {
    if (!hasStarted || isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, isFinished])

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
      if (objectiveIndex < OBJECTIVE_QUESTIONS.length - 1) {
        setObjectiveIndex(objectiveIndex + 1)
      } else {
        setCurrentType("essay")
        setEssayIndex(0)
      }
    } else if (currentType === "essay") {
      if (essayIndex < ESSAY_QUESTIONS.length - 1) {
        setEssayIndex(essayIndex + 1)
      } else {
        setCurrentType("project")
        setProjectIndex(0)
      }
    }
  }

  const handlePrev = () => {
    if (currentType === "project" && projectIndex === 0) {
      setCurrentType("essay")
      setEssayIndex(ESSAY_QUESTIONS.length - 1)
      return
    }
    if (currentType === "essay" && essayIndex === 0) {
      setCurrentType("objective")
      setObjectiveIndex(OBJECTIVE_QUESTIONS.length - 1)
      return
    }

    if (currentType === "objective") {
      if (objectiveIndex > 0) setObjectiveIndex(objectiveIndex - 1)
    } else if (currentType === "essay") {
      if (essayIndex > 0) setEssayIndex(essayIndex - 1)
    } else if (currentType === "project") {
      if (projectIndex > 0) setProjectIndex(projectIndex - 1)
    }
  }

  const renderBanner = () => (
    <div className="w-full bg-[#075546] text-white py-4 px-8 rounded-[1.5rem] shadow-sm">
      <h1 className="text-lg font-semibold">{PAGE_CONTENT.bannerTitle}</h1>
    </div>
  )

  const renderIntroCard = () => (
    <section className="mt-6 flex justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-10 py-10">
        <h2 className="text-base font-semibold mb-4">{PAGE_CONTENT.introTitle}</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-8">
          {PAGE_CONTENT.introDescription}
        </p>

        <hr className="border-gray-200 my-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-gray-700 mb-6">
          <div>
            <p className="font-semibold mb-2">{PAGE_CONTENT.infoTitle}</p>
            <p>
              {PAGE_CONTENT.durationLabel} <span className="font-semibold">{PAGE_CONTENT.durationValue}</span>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">&nbsp;</p>
            <p>
              {PAGE_CONTENT.sectionLabel} <span className="font-semibold">{PAGE_CONTENT.sectionValue}</span>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">&nbsp;</p>
            <p>
              {PAGE_CONTENT.deadlineLabel} <span className="font-semibold">{PAGE_CONTENT.deadlineValue}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          {PAGE_CONTENT.testDescription}
        </p>

        <hr className="border-gray-200 my-6" />

        <div className="mb-6">
          <p className="font-semibold text-sm mb-3">{PAGE_CONTENT.instructionTitle}</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {PAGE_CONTENT.instructions.map((inst, index) => (
              <li key={index}>{inst}</li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <NuraButton
            label={PAGE_CONTENT.buttonCancel}
            variant="secondary"
            type="button"
            className="max-w-[140px]"
          />
          <NuraButton
            label={PAGE_CONTENT.buttonStart}
            variant="primary"
            type="button"
            className="max-w-[140px]"
            onClick={() => setHasStarted(true)}
          />
        </div>
      </div>
    </section>
  )

  const renderSidebar = () => (
    <aside className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.sidebarTimeLeft}</p>
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          <Clock size={14} className={timeLeft < 300 ? "text-red-600" : "text-emerald-600"} />
          <span className="font-medium tracking-wide">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.sidebarObjective}</p>
        <div className="grid grid-cols-5 gap-2">
          {OBJECTIVE_QUESTIONS.map((q, index) => {
            const isActive = currentType === "objective" && objectiveIndex === index;
            const isAnswered = !!objectiveAnswers[q.id];

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
                {q.id}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.sidebarEssay}</p>
        <div className="flex flex-wrap gap-2">
          {ESSAY_QUESTIONS.map((q, index) => {
            const isActive = currentType === "essay" && essayIndex === index;
            const val = essayAnswers[q.id] || "";
            const isAnswered = val.replace(/<[^>]+>/g, '').trim().length > 0;
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
                {q.id}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.sidebarProject}</p>
        <div className="flex flex-wrap gap-2">
          {PROJECT_QUESTIONS.map((q, index) => {
            const isActive = currentType === "project" && projectIndex === index;
            const isAnswered = !!projectFiles[q.id];
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
                {q.id}
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
        <span className="font-semibold">{PAGE_CONTENT.contentObjective}</span>
        <span>
          {PAGE_CONTENT.contentQuestions} {objectiveIndex + 1} {PAGE_CONTENT.contentOf} {OBJECTIVE_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentObjective.points} {PAGE_CONTENT.contentPoints}</span>
      </div>

      <p className="text-sm text-gray-900 mb-6 leading-relaxed">{currentObjective.question}</p>

      <div className="space-y-3">
        {currentObjective.options.map((opt) => {
          const isSelected = objectiveAnswers[currentObjective.id] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setObjectiveAnswers(prev => ({ ...prev, [currentObjective.id]: opt }))}
              className={`w-full text-left text-sm rounded-xl px-4 py-3 border transition-colors ${isSelected
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200"
                }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </section>
  )

  const renderEssayContent = () => (
    <section className="flex-1">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
        <span className="font-semibold">{PAGE_CONTENT.contentEssay}</span>
        <span>
          {PAGE_CONTENT.contentQuestions} {essayIndex + 1} {PAGE_CONTENT.contentOf} {ESSAY_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentEssay.points} {PAGE_CONTENT.contentPoints}</span>
      </div>

      <p className="text-sm text-gray-900 mb-4 leading-relaxed">{currentEssay.question}</p>

      <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.contentAnswer}</p>

      <RichTextInput
        value={essayAnswers[currentEssay.id] ?? ""}
        onChange={(val) =>
          setEssayAnswers((prev) => ({
            ...prev,
            [currentEssay.id]: val,
          }))
        }
      />
    </section>
  )

  const renderProjectContent = () => (
    <section className="flex-1">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
        <span className="font-semibold">{PAGE_CONTENT.contentProject}</span>
        <span>
          {PAGE_CONTENT.contentQuestions} {projectIndex + 1} {PAGE_CONTENT.contentOf} {PROJECT_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentProject.points} {PAGE_CONTENT.contentPoints}</span>
      </div>

      <p className="text-sm font-semibold text-gray-900 mb-4 leading-relaxed">
        {currentProject.question}
      </p>

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

      <p className="text-xs font-semibold text-gray-700 mb-2">{PAGE_CONTENT.contentAnswer}</p>

      <FileUpload
        onFileSelect={(file) =>
          setProjectFiles((prev) => ({
            ...prev,
            [currentProject.id]: file,
          }))
        }
        maxSizeMB={5}
        accept=".py"
        supportedFileType=".py"
      />
    </section>
  )

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
            {PAGE_CONTENT.testPrevButton}
          </button>

          {currentType === "project" && projectIndex === PROJECT_QUESTIONS.length - 1 ? (
            <NuraButton
              label={PAGE_CONTENT.buttonSubmit}
              variant="primary"
              type="button"
              className="max-w-[140px]"
              onClick={handleSubmit}
            />
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 text-sm text-gray-800 hover:underline"
            >
              {PAGE_CONTENT.testNextButton}
              <span className="w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center">
                <ChevronRight size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )

  const renderFinishedCard = () => (
    <section className="mt-6 flex justify-center px-4 pb-20">
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-10 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-[#075546]">{PAGE_CONTENT.finishedTitle}</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-8 max-w-lg mx-auto">
          {PAGE_CONTENT.finishedDescription}
        </p>
        <NuraButton
          label={PAGE_CONTENT.buttonBackToCourse}
          variant="primary"
          type="button"
          className="mx-auto max-w-[240px]"
          onClick={() => {
            window.location.href = `/classes/${classId}/overview`
          }}
        />
      </div>
    </section>
  )

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: PAGE_CONTENT.breadcrumbHome, href: "/" },
            { label: PAGE_CONTENT.breadcrumbCourse, href: `/classes/${classId}/overview` },
            { label: PAGE_CONTENT.breadcrumbTest, href: `/classes/${classId}/test` },
          ]}
        />
      </div>

      <div className="px-6 mt-2">{renderBanner()}</div>

      {isFinished ? renderFinishedCard() : hasStarted ? renderTestCard() : renderIntroCard()}
    </main>
  )
}

