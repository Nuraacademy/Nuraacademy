"use client"

import { useState } from "react"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb/breadcrumb"
import { NuraButton } from "@/components/ui/button/button"
import { RichTextInput } from "@/components/rich_text_input"
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

export default function PlacementTestPage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentType, setCurrentType] = useState<QuestionType>("objective")
  const [objectiveIndex, setObjectiveIndex] = useState(0)
  const [essayIndex, setEssayIndex] = useState(0)
  const [projectIndex, setProjectIndex] = useState(0)
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({})
  const [projectFiles, setProjectFiles] = useState<Record<number, File | null>>({})

  const currentObjective = OBJECTIVE_QUESTIONS[objectiveIndex]
  const currentEssay = ESSAY_QUESTIONS[essayIndex]
  const currentProject = PROJECT_QUESTIONS[projectIndex]

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
    <div className="w-full bg-[#075546] text-white py-4 px-8 rounded-b-[1.5rem] shadow-sm">
      <h1 className="text-lg font-semibold">Placement Test</h1>
    </div>
  )

  const renderIntroCard = () => (
    <section className="mt-6 flex justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-10 py-10">
        <h2 className="text-base font-semibold mb-4">Hello, Learner!</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-8">
          Selamat datang di tahap awal perjalanan belajarmu. Hasil placement test ini membantu kami
          menentukan course yang bisa kamu lewati serta menempatkanmu dalam grup belajar sesuai
          materi yang perlu kamu pelajari. Jangan tegang dan lakukan yang terbaik!
        </p>

        <hr className="border-gray-200 my-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-gray-700 mb-6">
          <div>
            <p className="font-semibold mb-2">Detail Informasi Tes</p>
            <p>
              Duration: <span className="font-semibold">120 minutes</span>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">&nbsp;</p>
            <p>
              Section: <span className="font-semibold">3 sections</span>
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">&nbsp;</p>
            <p>
              Deadline: <span className="font-semibold">7 Maret 2026</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          Tes ini mengukur pemahaman dasar pemrograman untuk data analytics, termasuk konsep dasar
          cara kerja programming, penggunaan variabel dengan python, pengolahan data melalui file,
          penerapan selection dan looping statement, pembuatan fungsi (function), serta pengolahan
          array dan dataframe.
        </p>

        <hr className="border-gray-200 my-6" />

        <div className="mb-6">
          <p className="font-semibold text-sm mb-3">Instruksi</p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Pastikan koneksi internet stabil selama pengerjaan.</li>
            <li>
              Tes hanya dapat dilakukan satu kali, pastikan kamu memiliki waktu luang yang cukup.
            </li>
            <li>
              Dilarang menggunakan alat bantu AI atau mencari jawaban di luar platform selama tes
              berlangsung.
            </li>
            <li>Hasil penempatan grup akan diumumkan sehari setelah batas akhir pengisian tes.</li>
          </ol>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <NuraButton
            label="Cancel"
            variant="secondary"
            type="button"
            className="max-w-[140px]"
          />
          <NuraButton
            label="Start"
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
        <p className="text-xs font-semibold text-gray-700 mb-2">Time Left</p>
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs">
          <Clock size={14} className="text-red-600" />
          <span>00:20:10</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Objective Answer</p>
        <div className="grid grid-cols-5 gap-2">
          {OBJECTIVE_QUESTIONS.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentType("objective")
                setObjectiveIndex(index)
              }}
              className={`w-8 h-8 rounded-md text-xs flex items-center justify-center ${
                currentType === "objective" && objectiveIndex === index
                  ? "bg-[#075546] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Essay Answer</p>
        <div className="flex flex-wrap gap-2">
          {ESSAY_QUESTIONS.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentType("essay")
                setEssayIndex(index)
              }}
              className={`w-8 h-8 rounded-md text-xs flex items-center justify-center ${
                currentType === "essay" && essayIndex === index
                  ? "bg-[#075546] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Project Answer</p>
        <div className="flex flex-wrap gap-2">
          {PROJECT_QUESTIONS.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentType("project")
                setProjectIndex(index)
              }}
              className={`w-8 h-8 rounded-md text-xs flex items-center justify-center ${
                currentType === "project" && projectIndex === index
                  ? "bg-[#075546] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )

  const renderObjectiveContent = () => (
    <section className="flex-1">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
        <span className="font-semibold">Objective</span>
        <span>
          Questions {objectiveIndex + 1} of {OBJECTIVE_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentObjective.points} points</span>
      </div>

      <p className="text-sm text-gray-900 mb-6 leading-relaxed">{currentObjective.question}</p>

      <div className="space-y-3">
        {currentObjective.options.map((opt) => (
          <button
            key={opt}
            type="button"
            className="w-full text-left bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 rounded-xl px-4 py-3"
          >
            {opt}
          </button>
        ))}
      </div>
    </section>
  )

  const renderEssayContent = () => (
    <section className="flex-1">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-6">
        <span className="font-semibold">Essay</span>
        <span>
          Questions {essayIndex + 1} of {ESSAY_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentEssay.points} points</span>
      </div>

      <p className="text-sm text-gray-900 mb-4 leading-relaxed">{currentEssay.question}</p>

      <p className="text-xs font-semibold text-gray-700 mb-2">Answer</p>

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
        <span className="font-semibold">Project</span>
        <span>
          Questions {projectIndex + 1} of {PROJECT_QUESTIONS.length}
        </span>
        <span className="font-semibold">{currentProject.points} points</span>
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

      <p className="text-xs font-semibold text-gray-700 mb-2">Answer</p>

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
            Previous questions
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 text-sm text-gray-800 hover:underline"
          >
            Next questions
            <span className="w-7 h-7 rounded-full border border-gray-800 flex items-center justify-center">
              <ChevronRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )

  return (
    <main className="min-h-screen w-full bg-[#F9F9F0]">
      <div className="px-6 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Foundation to Data Analytics", href: "/classes" },
            { label: "Placement Test", href: "/classes/test" },
          ]}
        />
      </div>

      <div className="px-6 mt-2">{renderBanner()}</div>

      {hasStarted ? renderTestCard() : renderIntroCard()}
    </main>
  )
}

