import CourseExpander from "@/components/course_expander";

import { Clock, BarChart, Users, ChevronRight } from 'lucide-react';


export default async function CourseDetailPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    // Await the params to get the ID
    const { id } = await params;

    const imageUrl="https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp"
    const title="Introduction to Programming"
    const duration=12
    const level="Menengah"
    const capacity=5000
    const description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
    const price=500000
    const trainerProfilePictureUrl="https://upload.wikimedia.org/wikipedia/commons/0/03/Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg"
    const isEnrolled=true

    return (
        <main className="min-h-screen bg-[#F9F9F4] p-4 md:p-10 font-sans text-gray-800">
            <section className="relative bg-gradient-to-r from-[#005954] to-[#94B546] rounded-[2.5rem] overflow-hidden mb-10 flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 border border-white">
                <div className="w-full md:w-1/3 shrink-0">
                <img src={imageUrl || "/example/dummy.png"} alt="Course" className="rounded-[2rem] w-full h-64 object-cover shadow-lg"/>
                </div>

                <div className="flex-grow">
                <h1 className="text-3xl text-white font-bold mb-4">{title}</h1>
                
                <div className="flex flex-wrap gap-6 text-sm font-medium text-white mb-6">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Clock className="w-4 h-4 text-white" strokeWidth={2.5} />
                        {duration} Jam
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <BarChart className="w-4 h-4 text-white" strokeWidth={2.5} />
                        {level}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Users className="w-4 h-4 text-white" strokeWidth={2.5} />
                        {capacity.toLocaleString('id-ID')} Peserta
                    </div>
                </div>

                <p className="text-white max-w-2xl mb-8 leading-relaxed">
                    {description}
                </p>

                {
                    !isEnrolled && (
                        <div className="flex items-center justify-between md:justify-start md:gap-12">
                            <span className="text-2xl font-bold text-white">Rp{price.toLocaleString('id-ID')}/bulan</span>
                            <button className="bg-[#D9F066] hover:scale-105 transition-transform px-8 py-3 rounded-full font-bold shadow-md">
                                Enroll Now
                            </button>
                        </div>
                    )
                }
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <aside className="lg:col-span-3 space-y-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4">Trainers</h3>
                    <div className="flex items-center gap-4">
                        <img src={trainerProfilePictureUrl || "/example/human.png"} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-sm">Ningsih Herawati</p>
                            <p className="text-xs text-gray-500">Staff Developer at Google</p>
                        </div>
                        <hr className="border-t border-gray-200 my-4" />
                    </div>
                    

                    <hr className="border-t border-gray-200 my-4" />
                    <h3 className="font-bold mb-4">Instructors</h3>
                    <div className="flex items-center gap-4">
                        <img src={trainerProfilePictureUrl || "/example/human.png"} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-sm">Ningsih Herawati</p>
                            <p className="text-xs text-gray-500">Staff Developer at Google</p>
                        </div>
                        <hr className="border-t border-gray-200 my-4" />
                    </div>
                </div>
                

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="font-bold mb-2">Methods</h3>
                    <ul className="text-sm space-y-1 text-gray-600 list-disc ml-4">
                        <li>Ceramah</li>
                        <li>Praktik</li>
                        <li>Self study</li>
                    </ul>
                <hr className="border-t border-gray-200 my-4" />
                <h3 className="font-bold mb-2">Entry Skill</h3>
                    <ol className="text-sm space-y-2 text-gray-600 list-decimal ml-4">
                        <li>Mampu mengoperasikan Google Colab</li>
                        <li>Mampu mengoperasikan filling system dari Google Colab</li>
                    </ol>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-2">Course Aim</h3>
                    <ul className="text-sm space-y-2 text-gray-600 list-disc ml-4">
                        <li>3.1.    Peserta dapat mengingat aturan-aturan dasar pada pemrograman</li>
                        <li>3.1.1. Peserta dapat menjelaskan dengan cara sederhana bagaimana cara programming bekerja</li>
                        <li>3.2.    Peserta dapat mengoperasikan variabel-variabel menggunakan python</li>
                        <li>3.2.1. Peserta dapat membedakan jenis-jenis variabel pada python</li>
                        <li>3.3.    Peserta dapat mengoperasikan flat files untuk menyimpan data mentah maupun data hasil pemrosesan menggunakan python</li>
                        <li>3.3.1. Peserta memahami perintah-perintah yang dibutuhkan pada pengoperasian file</li>
                    </ul>
                </div>
                </aside>

                <section className="lg:col-span-9 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-8">Courses</h2>
                
                <div className="space-y-4">
                    <CourseExpander
                        classId={id}
                        courseId="1"
                        title="Pengenalan Pemrograman & Google Colab"
                        description="Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab. Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab. Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab."
                        isSynchronous={false}
                        isEnrolled={isEnrolled}
                    />
                    
                    <CourseExpander
                        classId={id}
                        courseId="2"
                        title="Pengenalan Pemrograman & Google Colab"
                        description="Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab. Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab. Memahami konsep dasar pemrograman, cara kerja program (input-process-output), serta pengenalan Google Colab."
                        isSynchronous={true}
                        isEnrolled={isEnrolled}
                    />
                </div>
                </section>

            </div>
            </main>
    );
}