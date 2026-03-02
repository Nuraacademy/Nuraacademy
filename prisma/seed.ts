import { prisma } from '../src/lib/prisma';
import { UserRole, SessionType, EnrollmentStatus, LearningObjective, AssignmentTag, AssignmentType, DiscussionTopicType } from '@prisma/client';

async function main() {
    console.log('--- Starting Ultra-Expanded Database Seeding ---');

    // 0. Sequential cleanup
    console.log('Cleaning up existing data...');
    const tables = [
        'presence', 'discussionReply', 'discussionTopic', 'assignmentSubmission',
        'assignment', 'exercise', 'postTestQuestion', 'postTest', 'preTestQuestion',
        'preTest', 'referenceMaterial', 'zoomSession', 'sessionVideo', 'session',
        'courseTool', 'courseEntrySkill', 'courseLearningObjective', 'course',
        'groupMember', 'group', 'enrollmentLearningObjective', 'enrollment',
        'objectiveAnswer', 'essayAnswer', 'projectAnswer', 'testSubmission',
        'placementObjectiveQuestion', 'placementEssayQuestion', 'placementProjectQuestion',
        'placementTest', 'classTimeline', 'classLearningPoint', 'class', 'user'
    ];

    for (const table of tables) {
        try {
            // @ts-ignore
            await prisma[table].deleteMany();
        } catch (error) {
            console.warn(`Could not clear table ${table}:`, error);
        }
    }

    console.log('Creating users...');
    const users = {
        admin: await prisma.user.create({ data: { email: 'admin@nura.academy', name: 'Nura Admin', role: UserRole.ADMIN } }),
        trainerBudi: await prisma.user.create({ data: { email: 'budi@nura.academy', name: 'Budi Santoso', role: UserRole.TRAINER } }),
        trainerRina: await prisma.user.create({ data: { email: 'rina@nura.academy', name: 'Rina Wijaya', role: UserRole.TRAINER } }),
        trainerAnton: await prisma.user.create({ data: { email: 'anton@nura.academy', name: 'Anton Syahputra', role: UserRole.TRAINER } }),
        studentAndi: await prisma.user.create({ data: { email: 'andi@example.com', name: 'Andi Pratama', role: UserRole.LEARNER } }),
        studentSiti: await prisma.user.create({ data: { email: 'siti@example.com', name: 'Siti Aminah', role: UserRole.LEARNER } }),
        studentBudi: await prisma.user.create({ data: { email: 'budi_m@example.com', name: 'Budi Mukti', role: UserRole.LEARNER } }),
        studentDewi: await prisma.user.create({ data: { email: 'dewi@example.com', name: 'Dewi Lestari', role: UserRole.LEARNER } }),
        studentEka: await prisma.user.create({ data: { email: 'eka@example.com', name: 'Eka Putra', role: UserRole.LEARNER } }),
        studentFahri: await prisma.user.create({ data: { email: 'fahri@example.com', name: 'Fahri Ramadhan', role: UserRole.LEARNER } }),
        studentGita: await prisma.user.create({ data: { email: 'gita@example.com', name: 'Gita Permata', role: UserRole.LEARNER } }),
    };

    console.log('Creating classes...');
    const classData = [
        {
            title: 'Foundation of Data Analytics',
            description: 'Master the basics of data analysis with Python, SQL, and statistics. This course covers everything from data cleaning to visualization.',
            imageUrl: 'https://www.yellowfinbi.com/assets/files/2025/08/effective_bi_dashboard_components_guide_yellowfin_bi.png',
            durationHours: 60,
            method: 'Flipped Blended Classroom',
            learningPoints: ['Understand core data science concepts', 'Proficiency in Python for data manipulation', 'Effective data visualization techniques', 'Foundational statistical analysis'],
            timeline: [
                { title: 'Enrollment Open', date: '2026-02-01' },
                { title: 'Placement Test', date: '2026-02-20' },
                { title: 'Batch Starts', date: '2026-03-01' },
                { title: 'Final Project', date: '2026-05-20' },
            ]
        },
        {
            title: 'Advanced Python for AI',
            description: 'Deep dive into Python for Artificial Intelligence. Learn complex data structures, algorithms, and AI libraries like PyTorch and TensorFlow.',
            imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop',
            durationHours: 80,
            method: 'Hybrid Intensive',
            learningPoints: ['Advanced Algorithms in Python', 'Neural Networks and Deep Learning', 'Computer Vision and NLP basics'],
            timeline: [
                { title: 'Registration', date: '2026-03-01' },
                { title: 'Course Start', date: '2026-04-01' },
                { title: 'Graduation', date: '2026-08-15' },
            ]
        },
        {
            title: 'UX Design Foundations',
            description: 'Learn the principles of user-centered design. From research and wireframing to prototyping and testing.',
            imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop',
            durationHours: 45,
            method: 'Online Synchronous',
            learningPoints: ['User research methodologies', 'Wireframing and Prototyping in Figma', 'Usability testing and iteration'],
            timeline: [
                { title: 'Open Registration', date: '2026-04-01' },
                { title: 'Class Start', date: '2026-05-15' },
            ]
        },
        {
            title: 'Cyber Security Essentials',
            description: 'Protect systems and networks from digital attacks. Learn hacking techniques (ethically) and how to defend against them.',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
            durationHours: 70,
            method: 'Bootcamp',
            learningPoints: ['Network Security', 'Cryptography', 'Ethical Hacking', 'Incident Response'],
            timeline: [
                { title: 'Launch', date: '2026-06-01' },
                { title: 'Demo Day', date: '2026-09-10' },
            ]
        }
    ];

    const classes = [];
    for (const c of classData) {
        const createdClass = await prisma.class.create({
            data: {
                title: c.title,
                description: c.description,
                imageUrl: c.imageUrl,
                durationHours: c.durationHours,
                scheduleStart: new Date(c.timeline[0].date),
                scheduleEnd: new Date(c.timeline[c.timeline.length - 1].date),
                method: c.method,
                learningPoints: { create: c.learningPoints.map((p, i) => ({ text: p, order: i + 1 })) },
                classTimelines: { create: c.timeline.map((t, i) => ({ title: t.title, date: new Date(t.date), order: i + 1 })) },
            }
        });
        classes.push(createdClass);
    }

    console.log('Adding Placement Tests and Questions...');
    for (const c of classes) {
        await prisma.placementTest.create({
            data: {
                classId: c.id,
                title: `${c.title} Readiness Test`,
                description: `Assess your basic skills for ${c.title}.`,
                durationMinutes: 45,
                instructions: ['Use a stable connection.', 'Complete all questions.'],
                objectiveQuestions: {
                    create: [
                        { question: 'Common logic question 1?', options: ['A', 'B', 'C', 'D'], points: 10, order: 1 },
                        { question: 'Technical basics question 2?', options: ['Answer1', 'Answer2', 'Answer3'], points: 10, order: 2 },
                    ]
                },
                essayQuestions: {
                    create: [
                        { question: 'Why are you interested in this field?', points: 30, order: 3 }
                    ]
                },
                projectQuestions: {
                    create: [
                        { question: 'Submit a link or file for a small task related to this class.', requirements: ['PDF/PNG', 'Max 10MB'], points: 50, order: 4 }
                    ]
                }
            }
        });
    }

    console.log('Adding Courses and Sessions for Data Analytics...');
    const analyticsCourses = [
        {
            title: 'Python Essentials for Data',
            description: 'Introduction to Python programming language within the context of data analytics.',
            order: 1,
            objectives: ['Perform basic Python operations', 'Handle variables and types'],
            sessions: [
                { title: 'Python Syntax & Variables', type: SessionType.ASYNCHRONOUS, videoUrl: 'https://www.youtube.com/embed/fW496SPlz5A' },
                { title: 'Live Coding: Data Structures', type: SessionType.SYNCHRONOUS, zoom: 'https://zoom.us/abc' },
            ]
        },
        {
            title: 'Data Wrangling with Pandas',
            description: 'Manipulating data effectively using the Pandas library.',
            order: 2,
            objectives: ['Filter and sort DataFrames', 'Handle missing data'],
            sessions: [
                { title: 'Introduction to Pandas', type: SessionType.ASYNCHRONOUS, videoUrl: 'https://www.youtube.com/embed/fW496Plz5A' },
                { title: 'Advanced Filtering', type: SessionType.ASYNCHRONOUS, videoUrl: 'https://www.youtube.com/embed/fW496SPlz5A' },
                { title: 'Workshop: Real World Data', type: SessionType.SYNCHRONOUS, zoom: 'https://zoom.us/xyz' },
            ]
        },
        {
            title: 'SQL Foundations',
            description: 'Querying databases like a pro.',
            order: 3,
            objectives: ['Write SELECT statements', 'Join multiple tables'],
            sessions: [
                { title: 'SQL Basics', type: SessionType.ASYNCHRONOUS, videoUrl: 'https://www.youtube.com/embed/fW496SPlz5A' },
                { title: 'Joins and Aggregates', type: SessionType.SYNCHRONOUS, zoom: 'https://zoom.us/sql' },
            ]
        }
    ];

    for (const crs of analyticsCourses) {
        await prisma.course.create({
            data: {
                classId: classes[0].id,
                title: crs.title,
                description: crs.description,
                order: crs.order,
                learningObjectives: { create: crs.objectives.map((obj, i) => ({ code: `LO${i + 1}`, text: obj, order: i + 1 })) },
                sessions: {
                    create: crs.sessions.map((sess, i) => ({
                        title: sess.title,
                        type: sess.type,
                        order: i + 1,
                        video: sess.videoUrl ? { create: { title: `${sess.title} Lecture`, url: sess.videoUrl } } : undefined,
                        zoomSession: sess.zoom ? { create: { link: sess.zoom, status: 'Scheduled' } } : undefined,
                        referenceMaterials: { create: [{ name: `${sess.title} Notes.pdf`, description: 'Lecture summary', fileUrl: '#' }] }
                    }))
                }
            }
        });
    }

    console.log('Enrolling students and forming groups...');
    const enrollmentPromises = [];
    const studentList = Object.values(users).filter(u => u.role === UserRole.LEARNER);

    for (const student of studentList) {
        enrollmentPromises.push(prisma.enrollment.create({
            data: {
                userId: student.id,
                classId: classes[0].id,
                status: EnrollmentStatus.ACTIVE,
                profession: 'Learner',
                learningObjectives: { create: [{ objective: LearningObjective.CAREER_SWITCH }] }
            }
        }));
    }
    await Promise.all(enrollmentPromises);

    await prisma.group.create({
        data: {
            classId: classes[0].id,
            name: 'Pioneers Alpha',
            members: { create: studentList.slice(0, 3).map(s => ({ userId: s.id })) }
        }
    });

    await prisma.group.create({
        data: {
            classId: classes[0].id,
            name: 'Pioneers Beta',
            members: { create: studentList.slice(3, 6).map(s => ({ userId: s.id })) }
        }
    });

    console.log('Seeding discussion topics...');
    const discussionData = [
        { title: 'Setup issues', content: 'Anyone having trouble with Python 3.12?', author: studentList[0].id, type: DiscussionTopicType.TECHNICAL_HELP },
        { title: 'Study group?', content: 'Would love to form a weekend study group.', author: studentList[1].id, type: DiscussionTopicType.GENERAL },
        { title: 'SQL Joins are confusing', content: 'Can someone explain left vs right joins?', author: studentList[2].id, type: DiscussionTopicType.TECHNICAL_HELP },
    ];

    for (const topic of discussionData) {
        await prisma.discussionTopic.create({
            data: {
                classId: classes[0].id,
                authorId: topic.author,
                title: topic.title,
                content: topic.content,
                type: topic.type,
                replies: {
                    create: [
                        { authorId: users.trainerBudi.id, content: 'Indeed, it can be tricky. Look at this diagram!' }
                    ]
                }
            }
        });
    }

    console.log('--- Seeding Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
