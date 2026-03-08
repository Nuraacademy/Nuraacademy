export type QuestionType = "objective" | "essay" | "project"

export interface ObjectiveQuestion {
    id: number
    question: string
    options: string[]
    points: number
}

export interface EssayQuestion {
    id: number
    question: string
    points: number
}

export interface ProjectQuestion {
    id: number
    question: string
    requirements: string[]
    points: number
}

export interface TestData {
    courseName: string
    introDescription: string
    durationMinutes: number
    sectionsCount: number
    deadlineValue: string
    testDescription: string
    instructions: string[]
    courseResults?: {
        courseId: number
        courseTitle: string
        status: "Pass" | "Not Pass"
    }[]
}

export interface PageText {
    bannerTitle: string
    introTitle: string
    infoTitle: string
    durationLabel: string
    durationValue: string
    sectionLabel: string
    sectionValue: string
    deadlineLabel: string
    instructionTitle: string
    buttonCancel: string
    buttonStart: string
    sidebarTimeLeft: string
    sidebarObjective: string
    buttonSubmit: string
    finishedTitle: string
    finishedDescription: string
    buttonBackToCourse: string
    sidebarEssay: string
    sidebarProject: string
    contentObjective: string
    contentEssay: string
    contentProject: string
    contentQuestions: string
    contentOf: string
    contentPoints: string
    contentAnswer: string
    testPrevButton: string
    testNextButton: string
    breadcrumbHome: string
    breadcrumbTest: string
}
