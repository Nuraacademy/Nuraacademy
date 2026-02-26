import { TEST_DATA } from "../constants"
import { NuraButton } from "@/components/ui/button/button";

interface FinishedCardProps {
    classId: string;
}

export function FinishedCard({ classId }: FinishedCardProps) {
    return (
        <section className="mt-6 flex flex-col items-center px-4 pb-20">
            <div className="w-full max-w-5xl bg-white rounded-[1.5rem] shadow-sm border border-gray-200 px-8 py-10 md:px-12 md:py-12 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Learner A</h2>
                <p className="text-sm md:text-base text-gray-700 mt-2 mb-8">{TEST_DATA.courseName}</p>

                <hr className="border-gray-200 mb-8" />

                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-6">Detail Hasil Tes</h3>

                <div className="w-full border border-gray-700 rounded-2xl md:rounded-[1.5rem] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300 bg-white">
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Course Title</span>
                        <span className="text-xs md:text-sm font-semibold text-gray-900">Status</span>
                    </div>

                    {/* Rows */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
                        <span className="text-xs md:text-sm text-gray-800">Course A</span>
                        <span className="px-5 py-1.5 bg-[#a3fa76] text-gray-900 text-xs font-medium rounded-full min-w-[80px] text-center">
                            Pass
                        </span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
                        <span className="text-xs md:text-sm text-gray-800">Course B</span>
                        <span className="px-5 py-1.5 bg-[#a3fa76] text-gray-900 text-xs font-medium rounded-full min-w-[80px] text-center">
                            Pass
                        </span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-5 bg-white">
                        <span className="text-xs md:text-sm text-gray-800">Course C</span>
                        <span className="px-5 py-1.5 bg-[#ff6b6b] text-gray-900 text-xs font-medium rounded-full min-w-[80px] text-center">
                            Not Pass
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <NuraButton
                label="Back"
                variant="secondary"
                className="border-transparent"
                onClick={() => {
                    window.location.href = `/classes/${classId}/overview`
                }}
                />
                <NuraButton
                    label="See Groups"
                    variant="primary"
                    className="min-w-[160px]"
                    onClick={() => {
                        window.location.href = `/classes/${classId}/groups`
                    }}
                />
            </div>
        </section>
    )
}
