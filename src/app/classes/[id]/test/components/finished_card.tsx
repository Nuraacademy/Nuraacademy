import { NuraButton } from "@/components/ui/button/button"
import { PAGE_TEXT } from "../constants"

interface FinishedCardProps {
    classId: string;
}

export function FinishedCard({ classId }: FinishedCardProps) {
    return (
        <section className="mt-6 flex justify-center px-4 pb-20">
            <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-10 py-16 text-center">
                <h2 className="text-3xl font-semibold mb-4 text-[#075546]">{PAGE_TEXT.finishedTitle}</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-8 max-w-lg mx-auto">
                    {PAGE_TEXT.finishedDescription}
                </p>
                <NuraButton
                    label={PAGE_TEXT.buttonBackToCourse}
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
}
