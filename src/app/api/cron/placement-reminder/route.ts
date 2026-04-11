import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';
import { endOfAppDay, formatAppDate, startOfAppDay } from '@/lib/appDatetime';

export async function GET(request: Request) {
  try {
    // Basic security check: if you have a CRON_SECRET env variable
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    // Jendela "hari ke-3 dari hari ini" dalam zona aplikasi (Asia/Jakarta)
    const in3DaysStart = new Date(startOfAppDay(now).getTime() + 3 * 24 * 60 * 60 * 1000);
    const in3DaysEnd = endOfAppDay(in3DaysStart);

    console.log(`Checking for placement tests between ${in3DaysStart.toISOString()} and ${in3DaysEnd.toISOString()}`);

    // Find placement tests starting in 3 days
    const placementTests = await prisma.assignment.findMany({
      where: {
        type: 'PLACEMENT',
        startDate: {
          gte: in3DaysStart,
          lte: in3DaysEnd,
        },
        deletedAt: null,
      },
      include: {
        class: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (placementTests.length === 0) {
      return NextResponse.json({ message: 'No placement tests starting in 3 days.' });
    }

    let totalSent = 0;

    for (const test of placementTests) {
      if (!test.classId) continue;

      // Find all learners enrolled in this class
      const enrollments = await prisma.enrollment.findMany({
        where: {
          classId: test.classId,
          status: 'ACTIVE',
          deletedAt: null,
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      const emailTasks = enrollments.map(async (enrollment) => {
        if (!enrollment.user.email) return;

        try {
          await sendMail({
            to: enrollment.user.email,
            subject: `Pengingat: Placement Test ${test.class?.title} 3 Hari Lagi!`,
            html: `
              <h1>Halo, ${enrollment.user.name || 'Peserta'}!</h1>
              <p><strong>Placement Test</strong> untuk kelas <strong>${test.class?.title}</strong> akan dilaksanakan dalam 3 hari, tepatnya pada tanggal <strong>${test.startDate ? formatAppDate(test.startDate) : ''}</strong>.</p>
              <p>Jangan sampai melewatkan tes ini! Silakan login ke akun LMS Anda untuk melihat instruksi lebih lengkap.</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/classes/${test.classId}/test" style="display:inline-block;background:#0070f3;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Ke Halaman Tes</a></p>
              <p>Sampai jumpa di kelas!</p>
            `,
          });
          totalSent++;
        } catch (err) {
          console.error(`Failed to send reminder to ${enrollment.user.email}:`, err);
        }
      });

      await Promise.all(emailTasks);
    }

    return NextResponse.json({ 
      message: `Successfully sent ${totalSent} reminder emails for ${placementTests.length} placement tests.`,
      testsChecked: placementTests.length,
      emailsSent: totalSent
    });

  } catch (error: any) {
    console.error('Placement reminder cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
