import { NuraButton } from "@/components/ui/button/button";
import ClassCard from "@/components/ui/card/class_card";
import HomeCard from "@/components/ui/card/home_card";
import HomeStoriesCard from "@/components/ui/card/home_stories_card";
import { getTopClasses } from "@/controllers/classController";
import Link from "next/link";

export default async function Home() {
  const topClasses = await getTopClasses(3);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-8 bg-[#F9F9EE]">

      {/* Section 1 - Hero */}
      <section>
        <img
          src="background/HomeBG.svg"
          alt="Background"
          className="absolute inset-0 h-90 w-full object-cover -z-0"
        />
        <div className="relative z-10 text-center text-white px-8 py-2 mb-4">
          <h1 className="text-4xl font-semibold mb-4">
            Kuasai Skill Digital, Raih Karier
            <br />Impian di Industri Global
          </h1>
          <p className="text-base leading-relaxed max-w-2xl mx-auto">
            Nura Academy adalah platform bootcamp online yang acuan kurikulumnya disusun berdasarkan
            kebutuhan industri terkini. Dari pemula hingga profesional, kamu dapat meningkatkan skill
            melalui materi yang aplikatif, praktik nyata, dan pengalaman belajar fleksibel.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex justify-between items-center text-center text-white px-16 py-2 mb-4">
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">10.000</span>
            <p className="text-sm">Pengguna Aktif</p>
          </div>
          <div className="text-white/40">|</div>
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">99%</span>
            <p className="text-sm">Kurikulum Berstandar Industri</p>
          </div>
          <div className="text-white/40">|</div>
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">3.400</span>
            <p className="text-sm">Submission Dinilai Ahlinya</p>
          </div>
        </div>
      </section>

      {/* Section 2 - Why Choose Us */}
      <section>
        <div className="text-center text-black px-8 py-12">
          <h2 className="text-4xl font-semibold mb-8">Why Choose Us</h2>
          <div className="flex justify-center items-stretch gap-8 flex-wrap">
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
      </section>

      {/* Section 3 - Success Stories */}
      <section>
        <div className="text-center bg-white rounded-t-[2rem] text-black px-8 py-12">
          <h2 className="text-4xl font-semibold mb-4">Inspiring Success Stories From Nura Academy Alumni</h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto">
            Alumni kami telah membuktikan kualitasnya di dunia kerja melalui sertifikasi
            berstandar industri dan keterampilan nyata yang siap diterapkan.
          </p>
          <div className="flex justify-center items-start gap-8 pt-8 flex-wrap">
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
      </section>

      {/* Section 4 - Top Classes */}
      <section>
        <div className="text-center text-black px-8 py-12">
          <h2 className="text-4xl font-semibold mb-4">Our Top Classes</h2>
          <div className="flex justify-center items-start gap-8 pt-8 flex-wrap">
            {topClasses.map((cls: any) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                imageUrl={cls.imageUrl || "/example/dummy.png"}
                title={cls.title}
                duration={cls.durationHours}
                scheduleStart={cls.scheduleStart}
                scheduleEnd={cls.scheduleEnd}
                method={cls.method}
                modules={0} // We can calculate this if needed
                description={cls.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - CTA Footer */}
      <section className="w-full flex justify-center px-4 py-12">
        <div className="relative w-full max-w-6xl rounded-[40px] overflow-hidden">
          <img
            src="/background/HomeFooterBG.svg"
            alt="CTA Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative flex flex-col items-center justify-center text-center text-white px-6 py-16 gap-6">
            <h2 className="text-4xl font-semibold">
              Siap Melangkah Lebih Lanjut?
            </h2>
            <p className="text-base md:text-2xl max-w-3xl">
              Ambil langkah pertama menuju karier impian Anda. Belajar, berkembang,
              dan sukses bersama Nura Academy.
            </p>
            <Link href="/register">
              <NuraButton
                label="Join Now"
                variant="primary"
              />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

