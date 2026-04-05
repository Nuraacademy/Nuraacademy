"use client"

import { NuraButton } from "@/components/ui/button/button";
import ClassCard from "@/components/ui/card/class_card";
import HomeCard from "@/components/ui/card/home_card";
import HomeStoriesCard from "@/components/ui/card/home_stories_card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getHomeClasses } from "@/app/actions/classes";
import { getHomeStats } from "@/app/actions/home";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [topClasses, setTopClasses] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, curricula: 0, submissions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHomeClasses().then(result => {
      if (result.success && result.classes) {
        setTopClasses(result.classes);
      }
    }).catch(() => {});

    getHomeStats().then(result => {
      if (result.success && result.stats) {
        setStats(result.stats);
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F9F9EE]">

      {/* Section 1 - Hero */}
      <section className="relative py-8">
        <Image
          src="/background/HomeBG.svg"
          alt="Background"
          fill
          priority
          className="object-cover -z-0"
        />
        <div className="relative z-10 text-center text-white px-8 py-2 mb-4">
          <h1 className="text-4xl font-semibold max-w-2xl mx-auto mb-4">
            Temukan Learning Path Anda! Bangun Kompetensi yang Dibutuhkan Industri
          </h1>
          <p className="text-base leading-relaxed max-w-3xl mx-auto">
            Nura Academy adalah platform bootcamp online yang acuan kurikulumnya disusun berdasarkan kebutuhan industri terkini. Dari pemula hingga profesional, kamu dapat meningkatkan skill melalui materi yang aplikatif, praktik nyata, dan pengalaman belajar fleksibel.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex justify-between items-center text-center text-white px-16 py-2 mb-4">
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">{stats.users.toLocaleString()}</span>
            <p className="text-sm">Pengguna Aktif</p>
          </div>
          <div className="text-white/40">|</div>
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">{stats.curricula.toLocaleString()}</span>
            <p className="text-sm">Kurikulum Berstandar Industri</p>
          </div>
          <div className="text-white/40">|</div>
          <div className="flex flex-col items-center w-full">
            <span className="text-xl font-semibold">{stats.submissions.toLocaleString()}</span>
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
            {isLoading ? (
              <div className="w-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C3A37]"></div>
              </div>
            ) : topClasses.length > 0 ? (
              topClasses.map((item) => (
                <ClassCard
                  key={item.id}
                  id={String(item.id)}
                  imageUrl={item.imgUrl}
                  title={item.title}
                  duration={item.hours || 0}
                  scheduleStart={item.startDate ? new Date(item.startDate) : undefined}
                  scheduleEnd={item.endDate ? new Date(item.endDate) : undefined}
                  method={item.methods}
                  courses={item.courses?.length || 0}
                  description={item.description}
                  isEnrolled={item.isEnrolled}
                  onClick={() => router.push(`/classes/${item.id}/overview`)}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">No classes available at the moment.</p>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <NuraButton
              label="See All Classes"
              variant="medium"
              onClick={() => router.push('/classes')}
            />
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center px-4 py-12">
        <div className="relative w-full max-w-6xl rounded-[40px] overflow-hidden min-h-[300px]">
          <Image
            src="/background/HomeFooterBG.svg"
            alt="CTA Background"
            fill
            className="object-cover"
          />
          <div className="relative flex flex-col items-center justify-center text-center text-white px-6 py-16 gap-6">
            <h2 className="text-4xl font-semibold">
              Siap Melangkah Lebih Lanjut?
            </h2>
            <p className="text-base md:text-xl max-w-3xl">
              Temukan cara baru untuk belajar dan mengembangkan keterampilan bersama Nura Academy!
            </p>
            <NuraButton
              label="Join Now"
              variant="primary"
              onClick={() => router.push('/register')}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
