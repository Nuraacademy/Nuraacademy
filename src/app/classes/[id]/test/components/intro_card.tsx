import { NuraButton } from "@/components/ui/button/button"
import { TestData, PageText } from "../types"
import { useRouter } from "next/navigation";

interface IntroCardProps {
    onStart: () => void;
    testData: TestData;
    pageText: PageText;
}

export function IntroCard({ onStart, testData, pageText }: IntroCardProps) {
    const router = useRouter();

    return (
        <section className="mt-6 flex justify-center">
            <div className="w-full max-w-7xl bg-white rounded-2xl shadow-sm border border-gray-200 px-10 py-10">
                <h2 className="text-base font-semibold mb-4">{pageText.introTitle}</h2>
                <div
                    className="text-sm text-gray-700 leading-relaxed mb-8 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: testData.introDescription }}
                />

                <hr className="border-gray-200 my-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm text-gray-700 mb-6">
                    <div>
                        <p className="font-semibold mb-2">{pageText.infoTitle}</p>
                        <p>
                            {pageText.durationLabel} {testData.durationMinutes > 0 ? (
                                <>{testData.durationMinutes} <span className="font-semibold">{pageText.durationValue}</span></>
                            ) : (
                                <span className="font-semibold">Unlimited</span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">&nbsp;</p>
                        <p>
                            {pageText.sectionLabel} {testData.sectionsCount} <span className="font-semibold">{pageText.sectionValue}</span>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">&nbsp;</p>
                        <p>
                            {pageText.deadlineLabel} <span className="font-semibold">{testData.deadlineValue}</span>
                        </p>
                    </div>
                </div>

                <div
                    className="text-sm text-gray-700 leading-relaxed mb-6 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: testData.testDescription }}
                />

                <hr className="border-gray-200 my-6" />

                <div className="mb-6">
                    <p className="font-semibold text-sm mb-3">{pageText.instructionTitle}</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {testData.instructions.map((inst, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: inst }} />
                        ))}
                    </ol>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <NuraButton
                        label={pageText.buttonCancel}
                        variant="secondary"
                        type="button"
                        className="max-w-[140px]"
                        onClick={() => router.back()}
                    />
                    <NuraButton
                        label={pageText.buttonStart}
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
