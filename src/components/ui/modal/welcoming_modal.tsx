"use client";

import { NuraButton } from "../button/button";
import { useRouter } from "next/navigation";

interface RoadmapStep {
  date: string;
  label: string;
}

interface WelcomingModalProps {
  isOpen: boolean;
  classId: string;
  steps: RoadmapStep[];
}


export default function WelcomingModal({
  isOpen,
  classId,
  steps
}: WelcomingModalProps) {
  if (!isOpen) return null;

  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-[2.5rem] px-10 py-10 md:px-16 md:py-12 shadow-2xl flex flex-col items-center text-center">

        {/* Icon */}
        <div className="mb-6 mt-2">
          <div className="w-24 h-24 flex items-center justify-center mx-auto">
            <img
                src="/icons/Confetti.svg"
                alt="Congratulation"
                className="w-24 h-24 object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Welcome to the Journey!
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-10">
          Here&apos;s your roadmap and key dates to get started
        </p>

        {/* Roadmap */}
        <div className="w-full max-w-4xl mx-auto mb-10">
          {/* Timeline container */}
          <div className="relative">
            {/* Dates row */}
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={`${step.date}-${index}-date`}
                  className="flex-1 flex justify-center"
                >
                  <span className="text-[11px] md:text-xs text-gray-700 whitespace-nowrap">
                    {step.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline line */}
            <div className="absolute left-0 right-0 h-[2px] bg-black mt-2" />

            {/* Timeline with circles and labels */}
            <div className="relative flex justify-between items-start">
              {steps.map((step, index) => (
                <div
                  key={`${step.date}-${index}-timeline`}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Circle */}
                  <div className="relative z-10 flex items-center justify-center mb-3">
                    <div className="w-5 h-5 rounded-full border-[3px] border-black bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  </div>
                  {/* Label */}
                  <p className="text-[11px] md:text-xs text-gray-800 text-center whitespace-nowrap">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start button */}
        <NuraButton
          label="Start Lesson"
          variant="primary"
          onClick={() => router.push(`/classes/${classId}/overview`)}
          className="mt-2"
        />
      </div>
    </div>
  );
}

