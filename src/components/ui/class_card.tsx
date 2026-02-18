"use client"

import { useRouter } from 'next/navigation';

import { Clock, BookText } from 'lucide-react';
import { NuraButton } from './button/button';

interface ClassCardProp {
    id: string,
    imageUrl?: string,
    title: string,
    method: string,
    scheduleStart: Date,
    scheduleEnd: Date,
    description: string,
    duration: number,
    modules: number
}

export default function ClassCard({
    id, imageUrl, title, method, scheduleStart, scheduleEnd, description, duration, modules
}: ClassCardProp) {
    const router = useRouter()

    return (
        <div className="flex flex-col bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 w-full max-w-[400px]">
            {/* Image Container */}
            <div className="mb-4">
                <img
                    src={imageUrl || "/example/dummy.png"}
                    alt={title}
                    className="h-56 w-full object-cover rounded-[1.5rem]"
                />
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow gap-3">
                <h3 className="font-bold text-xl text-gray-900 text-left justify-start">
                    {title}
                </h3>

                {/* Info Row - Using Lucide Icons */}
                <div className="flex justify-between items-center text-gray-600">
                    <div className="flex flex-col items-left justify-start text-left text-[12px]">
                        <div className='font-md font-semibold'> 
                            Methods
                        </div>
                        {method}
                    </div>
                    <div className="flex flex-col items-left justify-start text-left text-[12px]">
                        <div className='font-md font-semibold'> 
                            Schedules
                        </div>
                        {scheduleStart.toLocaleString('ID').split(',')[0]} - {scheduleEnd.toLocaleString('ID').split(',')[0]}
                    </div>
                </div>

                {/* Description */}
                <div className='font-md text-left text-[12px]'> 
                    <p className='font-semibold'>
                        Description
                    </p>
                    <p className="text-[12px]">
                        {description}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row flex-grow items-center justify-between gap-3 mt-4">
                <div className='flex flex-row items-left justify-start text-left text-[12px] gap-2'>
                    <Clock className='w-4 h-4'/>
                    <p className="text-[12px]">
                        {duration} Hours
                    </p>
                </div>
                <div className='flex flex-row items-left justify-start text-left text-[12px] gap-2'>
                    <BookText className='w-4 h-4'/>
                    <p className="text-[12px]">
                        {modules} Modules
                    </p>
                </div>
                <div>
                    <NuraButton
                        label="Enroll Now"
                        variant="navigate"
                        onClick={() => router.push(`/courses/about/${id}`)}
                    />
                </div>
            </div>
        </div>
    );
}