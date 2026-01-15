
import ClassCard from "@/components/class_card"

export default async function ClassesPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden pt-8">
            {/* Background Image */}
            <img
                src="background/ClassesBG.svg"
                alt="Background"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            
            {/* Content */}
            <div className="sticky justify-center text-center text-white px-8 py-4 mb-4">
                <h1 className="text-4xl font-semibold mb-4">
                    Tingkatkan Skillmu dengan 
                    <br />Kelas Berstandar Industri!
                </h1>
                <h2 className="text-xl">
                    Kelas online dengan kurikulum berbasis kebutuhan industri. Mulai dari pemula 
                    <br />hingga profesional, tingkatkan kompetensimu melalui materi terstruktur,
                    <br />praktik langsung, dan pembelajaran fleksibel sesuai ritmemu.
                </h2>
            </div>

            {/* Classes Container */}
            <div className="bg-white h-fill w-full rounded-4xl text-black px-24 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="flex justify-start text-2xl font-medium">
                        Explore Our Classes
                    </h1>
                    <div className="relative flex justify-end">
                        <select className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none">
                            <option>Filter</option>
                            <option>Kelas Pemula</option>
                            <option>Kelas Menegah</option>
                            <option>Kelas Professional</option>
                        </select>
                        <img 
                            src="/icons/Filter.svg" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                            alt=""
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-2xl mx-auto">
                    <ClassCard 
                        id="1"
                        imageUrl="https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp"
                        title="Introduction to Programming"
                        duration={12}
                        level="Menengah"
                        capacity={5000}
                        description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
                        price={500000}
                    />
                    <ClassCard 
                        id="2"
                        imageUrl="https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp"
                        title="Introduction to Programming"
                        duration={12}
                        level="Menengah"
                        capacity={5000}
                        description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
                        price={500000}
                    />
                    <ClassCard 
                        id="3"
                        imageUrl="https://www.lackawanna.edu/wp-content/uploads/2024/08/male-tutor-teaching-university-students-in-classro-2023-11-27-05-16-59-utc.webp"
                        title="Introduction to Programming"
                        duration={12}
                        level="Menengah"
                        capacity={5000}
                        description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
                        price={500000}
                    />
                </div>
                
            </div>
            
        </main>
    )
}