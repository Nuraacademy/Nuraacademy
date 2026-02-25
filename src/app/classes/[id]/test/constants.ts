import { ObjectiveQuestion, EssayQuestion, ProjectQuestion } from "./types"

export const OBJECTIVE_QUESTIONS: ObjectiveQuestion[] = Array.from({ length: 15 }).map(
    (_, index) => ({
        id: index + 1,
        question:
            "Proses pengumpulan data dari berbagai sumber sebelum disimpan dalam sistem big data disebut ...",
        options: ["A. Data Visualization", "B. Data Ingestion", "C. Data Modeling", "D. Data Reporting"],
        points: 10,
    }),
)

export const ESSAY_QUESTIONS: EssayQuestion[] = Array.from({ length: 5 }).map((_, index) => ({
    id: index + 1,
    question:
        "Bandingkan perbedaan antara structured, semi-structured, dan unstructured data. Jelaskan ciri masing-masing, contoh di sekitar anda, tantangan dalam pengolahannya.",
    points: 20,
}))

export const PROJECT_QUESTIONS: ProjectQuestion[] = [
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

export const TEST_DATA = {
    courseName: "Foundation to Data Analytics",
    introDescription:
        "Selamat datang di tahap awal perjalanan belajarmu. Hasil placement test ini membantu kami menentukan course yang bisa kamu lewati serta menempatkanmu dalam grup belajar sesuai materi yang perlu kamu pelajari. Jangan tegang dan lakukan yang terbaik!",
    durationMinutes: 120,
    sectionsCount: (OBJECTIVE_QUESTIONS.length > 0 ? 1 : 0) + (ESSAY_QUESTIONS.length > 0 ? 1 : 0) + (PROJECT_QUESTIONS.length > 0 ? 1 : 0),
    deadlineValue: "7 Maret 2026",
    testDescription:
        "Tes ini mengukur pemahaman dasar pemrograman untuk data analytics, termasuk konsep dasar cara kerja programming, penggunaan variabel dengan python, pengolahan data melalui file, penerapan selection dan looping statement, pembuatan fungsi (function), serta pengolahan array dan dataframe.",
    instructions: [
        "Pastikan koneksi internet stabil selama pengerjaan.",
        "Tes hanya dapat dilakukan satu kali, pastikan kamu memiliki waktu luang yang cukup.",
        "Dilarang menggunakan alat bantu AI atau mencari jawaban di luar platform selama tes berlangsung.",
        "Hasil penempatan grup akan diumumkan sehari setelah batas akhir pengisian tes.",
    ],
}

export const PAGE_TEXT = {
    bannerTitle: "Placement Test",
    introTitle: "Hello, Learner!",
    infoTitle: "Detail Informasi Tes",
    durationLabel: "Duration:",
    durationValue: "minutes",
    sectionLabel: "Section:",
    sectionValue: "sections",
    deadlineLabel: "Deadline:",
    instructionTitle: "Instruksi",
    buttonCancel: "Cancel",
    buttonStart: "Start",
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
    breadcrumbTest: "Placement Test",
}

export type TestData = typeof TEST_DATA
export type PageText = typeof PAGE_TEXT
