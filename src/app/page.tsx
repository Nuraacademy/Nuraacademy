import { NuraButton } from "@/components/ui/button/button";
import ClassCard from "@/components/ui/class_card";
import HomeCard from "@/components/ui/home_card";
import HomeStoriesCard from "@/components/ui/home_card copy";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full -z-11 overflow-hidden pt-8 bg-[#F9F9EE]">
      <img
        src="background/HomeBG.svg"
        alt="Background"
        className="absolute inset-0 -z-10 h-80 w-full object-cover"
      />
      {/* Section 1 - Hero */}
      <div>
        {/* Content */}
        <div className="sticky justify-center text-center text-white px-8 py-2 mb-4">
          <h1 className="text-4xl font-semibold mb-4">
            Kuasai Skill Digital, Raih Karier
            <br />Impian di Industri Global
          </h1>
          <h2 className="text-l">
            Nura Academy adalah platform bootcamp online yang acuan kurikulumnya disusun berdasarkan
            <br />kebutuhan industri terkini. Dari pemula hingga profesional, kamu dapat meningkatkan skill
            <br />melalui materi yang aplikatif, praktik nyata, dan pengalaman belajar fleksibel.
          </h2>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-center text-white px-16 py-2 mb-4">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-xl">10.000</h1>
            <p className="text-sm">Pengguna Aktif</p>
          </div>
          <div>
            |
          </div>
          <div className="flex flex-col items-center w-full"> 
            <h1 className="text-xl">99%</h1>
            <p className="text-sm">Kurikulum Berstandar Industri</p>
          </div>
          <div>
            |
          </div>
          <div className="flex flex-col items-center w-full">
            <h1 className="text-xl">3.400</h1>
            <p className="text-sm">Submission Dinilai Ahlinya</p>
          </div>
        </div>
      </div>

      {/* Section 2 - Why Choose Us */}
      <div>
        <div className="sticky justify-center text-center text-black px-8 py-12 mb-4">
          <h1 className="text-4xl font-semibold mb-4">Why Choose Us</h1>
          <div className="flex justify-center items-center gap-8">
            <HomeCard
              header="Community-Based"
              description="Forum Diskusi aktif ala Stackoverflow"
            />
            <HomeCard
              header="Flexible Learning"
              description="Gabungkan materi asinkron (video/teks) dan sesi live"
            />
            <HomeCard
              header="Personalized Feedback"
              description="Review tugas langsung dari trainer berpengalaman"
            />
          </div>
        </div>
      </div>

      {/* Section 3 - Inspiration */}
      <div>
        <div className="sticky justify-center text-center bg-white rounded-t-[2rem] text-black px-8 py-12 mb-4">
          <h1 className="text-4xl font-semibold mb-4">Inspiring Success Stories From Nura Academy Alumni</h1>
          <p className="text-md leading-relaxed">Alumni kami telah membuktikan kualitasnya di dunia kerja melalui sertifikasi
            <br/>berstandar industri dan keterampilan nyata yang siap diterapkan.</p>
          
          <div className="flex justify-center items-center gap-8 pt-8">
            <HomeStoriesCard
              image="/example/human.png"
              name="Ningsih Herawati"
              bootcamp="Bootcamp Data Science Batch 3"
              description="Mentornya asik-asik! Apalagi mentornya selalu memberikan ilmu baru tiap minggunya yang benar-benar berguna banget buat pembuatan proyekan data science dan persiapan agar bisa berkarir di dunia data science. Thanks Nura Academy"
            />
            <HomeStoriesCard
              image="/example/human.png"
              name="Ningsih Herawati"
              bootcamp="Bootcamp Data Science Batch 3"
              description="Mentornya asik-asik! Apalagi mentornya selalu memberikan ilmu baru tiap minggunya yang benar-benar berguna banget buat pembuatan proyekan data science dan persiapan agar bisa berkarir di dunia data science. Thanks Nura Academy"
            />
            <HomeStoriesCard
              image="/example/human.png"
              name="Ningsih Herawati"
              bootcamp="Bootcamp Data Science Batch 3"
              description="Mentornya asik-asik! Apalagi mentornya selalu memberikan ilmu baru tiap minggunya yang benar-benar berguna banget buat pembuatan proyekan data science dan persiapan agar bisa berkarir di dunia data science. Thanks Nura Academy"
            />
          </div>
        </div>
      </div>

      {/* Section 4 - Top Classes */}

      <div>
        <div className="sticky justify-center text-center text-black px-8 py-12 mb-4">
          <h1 className="text-4xl font-semibold mb-4">Our Top Classes</h1>
          
          <div className="flex justify-center items-center gap-8 pt-8">
            <ClassCard  
              id="1"
              imageUrl="/example/dummy.png"
              title="Intorduction to Programming"
              duration={55}
              scheduleStart={new Date("2026-02-22")}
              scheduleEnd={new Date("2026-05-31")}
              method="Flipped blended classroom"
              modules={5}
              description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
            />
            <ClassCard  
              id="1"
              imageUrl="/example/dummy.png"
              title="Intorduction to Programming"
              duration={55}
              scheduleStart={new Date("2026-02-22")}
              scheduleEnd={new Date("2026-05-31")}
              method="Flipped blended classroom"
              modules={5}
              description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
            />
            <ClassCard  
              id="1"
              imageUrl="/example/dummy.png"
              title="Intorduction to Programming"
              duration={55}
              scheduleStart={new Date("2026-02-22")}
              scheduleEnd={new Date("2026-05-31")}
              method="Flipped blended classroom"
              modules={5}
              description="Kelas ini dirancang untuk peserta yang ingin memahami konsep dasar pemrograman menggunakan python. Pembelajaran fokus pada pemahaman cara kerja program, penggunaan variabel, serta pengelolaan file."
            />
          </div>
        </div>
      </div>

      

    </div>
  );
}
