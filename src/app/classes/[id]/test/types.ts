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
