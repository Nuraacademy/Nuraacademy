import { NuraButton } from "@/components/ui/button/button"
import { TEST_DATA, PAGE_TEXT } from "../constants"

interface IntroCardProps {
    onStart: () => void;
}

export function IntroCard({ onStart }: IntroCardProps) {
    return (
        <section className="mt-6 flex justify-center px-4">
            <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-sm border border-gray-200 px-10 py-10">
                <h2 className="text-base font-semibold mb-4">{PAGE_TEXT.introTitle}</h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-8">
                    {TEST_DATA.introDescription}
                </p>

                <hr className="border-gray-200 my-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-gray-700 mb-6">
                    <div>
                        <p className="font-semibold mb-2">{PAGE_TEXT.infoTitle}</p>
                        <p>
                            {PAGE_TEXT.durationLabel} {TEST_DATA.durationMinutes} <span className="font-semibold">{PAGE_TEXT.durationValue}</span>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">&nbsp;</p>
                        <p>
                            {PAGE_TEXT.sectionLabel} {TEST_DATA.sectionsCount} <span className="font-semibold">{PAGE_TEXT.sectionValue}</span>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">&nbsp;</p>
                        <p>
                            {PAGE_TEXT.deadlineLabel} <span className="font-semibold">{TEST_DATA.deadlineValue}</span>
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    {TEST_DATA.testDescription}
                </p>

                <hr className="border-gray-200 my-6" />

                <div className="mb-6">
                    <p className="font-semibold text-sm mb-3">{PAGE_TEXT.instructionTitle}</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {TEST_DATA.instructions.map((inst, index) => (
                            <li key={index}>{inst}</li>
                        ))}
                    </ol>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <NuraButton
                        label={PAGE_TEXT.buttonCancel}
                        variant="secondary"
                        type="button"
                        className="max-w-[140px]"
                    />
                    <NuraButton
                        label={PAGE_TEXT.buttonStart}
                        variant="primary"
                        type="button"
                        className="max-w-[140px]"
                        onClick={onStart}
                    />
                </div>
            </div>
        </section>
    )
}
