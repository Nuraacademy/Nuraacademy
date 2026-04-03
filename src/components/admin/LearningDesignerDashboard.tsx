"use client"

import Image from 'next/image';
import { DashboardData } from '@/app/actions/dashboard';
import { useRouter } from 'next/navigation';
import ClassSection from './dashboard/ClassSection';
import AssignmentSection from './dashboard/AssignmentSection';

interface DashboardProps {
    data: DashboardData;
}

import { NuraButton } from '../ui/button/button';

export default function LearningDesignerDashboard({ data }: DashboardProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F9F9EE] relative overflow-hidden ">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image src="/background/PolygonBGTop.svg" alt="Background Top" fill className="object-cover object-left-top" priority />
            </div>
            <div className="absolute bottom-0 right-0 w-full md:w-[60%] h-[40rem] pointer-events-none opacity-40">
                <Image src="/background/PolygonBGBot.svg" alt="Background Bottom" fill className="object-cover object-right-bottom" />
            </div>

            <div className="relative z-10 px-4 md:px-16 py-10 md:py-16 space-y-12">
                <header className="space-y-2">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1C3A37] tracking-tight">
                        Welcome, {data.user.name.split(' ')[0]}!
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column - 8 columns */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 1. Classes Section (Reusable) */}
                        <ClassSection classes={data.classes} />

                        {/* 2. Action Buttons & Split Area */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-7">
                                {/* Analytics & Report */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Analytics & Report</h2>
                                        <button onClick={() => router.push('/admin/users?filter=learner')} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">See All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {data.analytics.slice(0, 3).map((learner) => (
                                            <div key={learner.id} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                                                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-sm border-2 border-white shrink-0">
                                                    {learner.image ? (
                                                        <Image src={learner.image} alt={learner.name} fill className='object-cover' />
                                                    ) : (
                                                        <Image src={`/example/human.png`} alt={learner.name} fill className='object-cover' />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h4 className="text-base font-medium text-[#1C3A37] leading-none">{learner.name}</h4>
                                                    <p className="text-sm text-gray-400 font-medium leading-tight">{learner.className} | Batch Number</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-8">
                                {/* Yellow Buttons */}
                                <div className="grid grid-cols-1 gap-4">
                                    <NuraButton
                                        variant="primary"
                                        label='Learners List'
                                        onClick={() => router.push('/admin/users?filter=learner')}
                                        leftIcon={<Image src="/icons/People.svg" alt="Learners" width={24} height={24} />}
                                    />
                                    <NuraButton
                                        variant="primary"
                                        label='Feedback'
                                        onClick={() => router.push('/feedback')}
                                        leftIcon={<Image src="/icons/Feedback.svg" alt="Feedback" width={24} height={24} />}
                                    />
                                </div>

                                {/* Instructor & Trainer */}
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Instructor & Trainer</h2>
                                        <button onClick={() => router.push('/admin/users?filter=staff')} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">See All</button>
                                    </div>
                                    <div className="space-y-4">
                                        {data.trainers.slice(0, 2).map((trainer) => (
                                            <div key={trainer.id} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                                                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-sm border-2 border-white shrink-0">
                                                    {trainer.image ? (
                                                        <Image src={trainer.image} alt={trainer.name} fill className='object-cover' />
                                                    ) : (
                                                        <Image src={`/example/human.png`} alt={trainer.name} fill className='object-cover' />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h4 className="text-base font-medium text-[#1C3A37] leading-none">{trainer.name}</h4>
                                                    <p className="text-sm text-gray-400 font-medium leading-tight">Staff Developer at Google</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 4 columns */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Placement Test
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Placement Test</h2>
                                <button onClick={() => router.push('/assignment')} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">See All</button>
                            </div>
                            <div className="space-y-4">
                                {data.assignments.filter(a => a.type === "PLACEMENT").slice(0, 1).map((item) => (
                                    <AssignmentCard
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        tag={item.submissionType === 'Group' ? 'Group' : 'Individual'}
                                        classId={String(item.className)} // Reusing classTitle slot
                                        courseId={String(item.courseName)} 
                                        sessionId={"0"}
                                        type={mapPrismaAssignmentType(item.type)}
                                        classTitle={item.className}
                                        courseTitle={item.courseName}
                                        canGrade={false}
                                        isAdmin={false}
                                    />
                                ))}
                                {data.assignments.filter(a => a.type === "PLACEMENT").length === 0 && (
                                    <div className="p-8 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs italic">No placement tests</div>
                                )}
                            </div>
                        </div> */}

                        {/* Assignments (Reusable) */}
                        <AssignmentSection assignments={data.assignments} />

                        {/* Curricula (Manual list matching AssignmentCard layout) */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-medium text-[#1C3A37]">Curricula</h2>
                                <button onClick={() => router.push('/curricula')} className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">See All</button>
                            </div>
                            <div className="space-y-4">
                                {data.curricula.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex rounded-xl">
                                            <Image src="/icons/Curricula.svg" alt="Curricula" width={40} height={40} />
                                        </div>
                                        <h3 className="text-base font-medium text-[#1C3A37]">{item.title}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
