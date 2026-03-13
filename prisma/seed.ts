import { AssignmentType, AssignmentItemType, SubmissionType, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Starting extended seed...')

    // 0. Ensure Roles exist (or fetch them)
    const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
    const teacherRole = await prisma.role.findUnique({ where: { name: 'Instructur' } });
    const studentRole = await prisma.role.findUnique({ where: { name: 'Learner' } });

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const userData = [
        { email: 'admin@learning.com', username: 'admin', password: hashedPassword, name: 'Admin User', roleId: adminRole?.id },
        { email: 'teacher1@learning.com', username: 'teacher1', password: hashedPassword, name: 'John Doe - Web Instructor', roleId: teacherRole?.id },
        { email: 'teacher2@learning.com', username: 'teacher2', password: hashedPassword, name: 'Sarah Lim - Data Instructor', roleId: teacherRole?.id },
        { email: 'student1@learning.com', username: 'student1', password: hashedPassword, name: 'Alice Johnson', roleId: studentRole?.id },
        { email: 'student2@learning.com', username: 'student2', password: hashedPassword, name: 'Bob Smith', roleId: studentRole?.id },
        { email: 'student3@learning.com', username: 'student3', password: hashedPassword, name: 'Carol Wilson', roleId: studentRole?.id },
        { email: 'student4@learning.com', username: 'student4', password: hashedPassword, name: 'David Brown', roleId: studentRole?.id },
        { email: 'student5@learning.com', username: 'student5', password: hashedPassword, name: 'Eva Davis', roleId: studentRole?.id },
    ];

    for (const user of userData) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {
                roleId: user.roleId
            },
            create: user,
        });
    }

    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@learning.com' } })
    const teacher1 = await prisma.user.findUnique({ where: { email: 'teacher1@learning.com' } })
    const teacher2 = await prisma.user.findUnique({ where: { email: 'teacher2@learning.com' } })
    const student1 = await prisma.user.findUnique({ where: { email: 'student1@learning.com' } })
    const student2 = await prisma.user.findUnique({ where: { email: 'student2@learning.com' } })
    const student3 = await prisma.user.findUnique({ where: { email: 'student3@learning.com' } })
    const student4 = await prisma.user.findUnique({ where: { email: 'student4@learning.com' } })
    const student5 = await prisma.user.findUnique({ where: { email: 'student5@learning.com' } })

    // 2. Create Classes
    const webDevClass = await prisma.class.create({
        data: {
            title: 'Full Stack Web Development Bootcamp',
            imgUrl: 'https://example.com/webdev.jpg',
            hours: 80,
            methods: 'Live Online + Projects',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-06-15'),
            description: 'Master full stack development from scratch',
            learningObjective: 'Build and deploy production web apps',
            isDraft: false,
            createdBy: adminUser!.id,
        },
    })

    const dataScienceClass = await prisma.class.create({
        data: {
            title: 'Data Science & Analytics Professional',
            imgUrl: 'https://example.com/datascience.jpg',
            hours: 60,
            methods: 'Online + Hands-on Labs',
            startDate: new Date('2026-04-15'),
            endDate: new Date('2026-06-30'),
            description: 'Complete data science pipeline',
            learningObjective: 'Build end-to-end data solutions',
            isDraft: false,
            createdBy: teacher2!.id,
        },
    })

    // 3. Create EXTENDED Courses untuk Web Dev Class
    const webDevCourses = await Promise.all([
        prisma.course.create({
            data: {
                classId: webDevClass.id,
                title: 'HTML/CSS/JavaScript Fundamentals',
                description: 'Master web fundamentals',
                learningObjectives: 'Build responsive layouts',
                entrySkills: 'None',
                tools: 'VS Code, Chrome DevTools',
                createdBy: teacher1!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: webDevClass.id,
                title: 'React & Next.js Development',
                description: 'Modern React development',
                learningObjectives: 'Build SPAs with Next.js',
                entrySkills: 'HTML/CSS/JS',
                tools: 'React, Next.js, Tailwind',
                createdBy: teacher1!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: webDevClass.id,
                title: 'Node.js & Express APIs',
                description: 'Build RESTful APIs',
                learningObjectives: 'Create scalable backends',
                entrySkills: 'JavaScript',
                tools: 'Node.js, Express, Prisma',
                createdBy: teacher1!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: webDevClass.id,
                title: 'Database Design & PostgreSQL',
                description: 'Advanced database concepts',
                learningObjectives: 'Design normalized databases',
                entrySkills: 'SQL basics',
                tools: 'PostgreSQL, Prisma, pgAdmin',
                createdBy: teacher1!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: webDevClass.id,
                title: 'DevOps & Deployment',
                description: 'Production deployment pipeline',
                learningObjectives: 'Deploy to cloud platforms',
                entrySkills: 'Basic web dev',
                tools: 'Docker, Vercel, Railway',
                createdBy: teacher1!.id,
            }
        }),
    ])

    // 4. Create EXTENDED Courses untuk Data Science Class
    const dataScienceCourses = await Promise.all([
        prisma.course.create({
            data: {
                classId: dataScienceClass.id,
                title: 'Python for Data Science',
                description: 'Python data science stack',
                learningObjectives: 'Data manipulation & visualization',
                entrySkills: 'Basic programming',
                tools: 'Python, Jupyter, Pandas',
                createdBy: teacher2!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: dataScienceClass.id,
                title: 'SQL & Database Querying',
                description: 'Advanced SQL techniques',
                learningObjectives: 'Complex data analysis queries',
                entrySkills: 'Basic SQL',
                tools: 'PostgreSQL, Snowflake',
                createdBy: teacher2!.id,
            }
        }),
        prisma.course.create({
            data: {
                classId: dataScienceClass.id,
                title: 'Data Visualization with Plotly',
                description: 'Interactive dashboards',
                learningObjectives: 'Create production dashboards',
                entrySkills: 'Python basics',
                tools: 'Plotly, Dash, Streamlit',
                createdBy: teacher2!.id,
            }
        }),
    ])

    // 5. Create Multiple Sessions
    const sessions = await Promise.all([
        // Web Dev Sessions
        prisma.session.create({
            data: {
                courseId: webDevCourses[0].id, // HTML/CSS/JS
                isSynchronous: true,
                title: 'Flexbox & CSS Grid Mastery',
                content: { slides: 'flexbox.pdf', exercises: 5 },
                schedule: { date: '2026-04-08T10:00:00Z', duration: 120 },
                reference: ['css-tricks.com', 'flexboxfroggy.com'],
                createdBy: teacher1!.id,
            }
        }),
        prisma.session.create({
            data: {
                courseId: webDevCourses[1].id, // React
                isSynchronous: true,
                title: 'React Hooks Deep Dive',
                content: { video: 'react-hooks.mp4', code: 'hooks-example' },
                schedule: { date: '2026-04-22T14:00:00Z', duration: 180 },
                reference: ['react.dev', 'nextjs.org'],
                createdBy: teacher1!.id,
            }
        }),
        // Data Science Sessions
        prisma.session.create({
            data: {
                courseId: dataScienceCourses[0].id, // Python
                isSynchronous: false,
                title: 'Pandas Data Manipulation',
                content: { notebook: 'pandas_lab.ipynb' },
                schedule: { availableFrom: '2026-04-20' },
                reference: ['pandas.pydata.org'],
                createdBy: teacher2!.id,
            }
        }),
    ])

    // 6. Create Enrollments
    await prisma.enrollment.createMany({
        data: [
            { userId: student1!.id, classId: webDevClass.id },
            { userId: student2!.id, classId: webDevClass.id },
            { userId: student3!.id, classId: dataScienceClass.id },
            { userId: student4!.id, classId: dataScienceClass.id },
            { userId: student5!.id, classId: webDevClass.id },
        ],
    })

    // 7. Create EXTENDED Assignments
    const assignments = await Promise.all([
        // Web Dev Assignments
        prisma.assignment.create({
            data: {
                classId: webDevClass.id,
                courseId: webDevCourses[0].id,
                type: AssignmentType.PRETEST,
                submissionType: SubmissionType.INDIVIDUAL,
                duration: 45,
                startDate: new Date('2026-04-02'),
                endDate: new Date('2026-04-05'),
                description: 'Frontend Fundamentals Assessment',
                instruction: 'Complete 20 multiple choice questions',
                passingGrade: 70,
                createdBy: teacher1!.id,
            }
        }),
        prisma.assignment.create({
            data: {
                classId: webDevClass.id,
                courseId: webDevCourses[1].id,
                sessionId: sessions[1].id,
                type: AssignmentType.EXERCISE,
                submissionType: SubmissionType.INDIVIDUAL,
                duration: 120,
                startDate: new Date('2026-04-25'),
                endDate: new Date('2026-04-30'),
                description: 'React Hooks Practice',
                instruction: 'Build counter, todo, dan form components',
                passingGrade: 80,
                createdBy: teacher1!.id,
            }
        }),
        prisma.assignment.create({
            data: {
                classId: webDevClass.id,
                courseId: webDevCourses[1].id,
                type: AssignmentType.PROJECT,
                submissionType: SubmissionType.GROUP,
                duration: 1440,
                startDate: new Date('2026-05-01'),
                endDate: new Date('2026-05-20'),
                description: 'E-Commerce Dashboard',
                instruction: `
        1. Product listing with search/filter
        2. Shopping cart functionality
        3. Authentication & user profile
        4. Deploy to Vercel
      `,
                passingGrade: 85,
                createdBy: teacher1!.id,
            }
        }),
        // Data Science Assignments
        prisma.assignment.create({
            data: {
                classId: dataScienceClass.id,
                courseId: dataScienceCourses[0].id,
                type: AssignmentType.ASSIGNMENT,
                submissionType: SubmissionType.INDIVIDUAL,
                duration: 180,
                startDate: new Date('2026-04-28'),
                endDate: new Date('2026-05-05'),
                description: 'Sales Data Analysis',
                instruction: 'Analyze sales dataset with Pandas',
                passingGrade: 75,
                createdBy: teacher2!.id,
            }
        }),
    ])

    // 8. Create EXTENDED Assignment Items (20+ items)
    const assignmentItemsData = [
        // Pretest Assignment (10 MCQ)
        ...Array.from({ length: 10 }, (_, i) => ({
            assignmentId: assignments[0].id,
            type: AssignmentItemType.OBJECTIVE,
            question: `Frontend Question ${i + 1}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A',
            maxScore: 5,
            createdBy: teacher1!.id,
        })),

        // React Hooks Exercise (5 items)
        {
            assignmentId: assignments[1].id,
            type: AssignmentItemType.OBJECTIVE,
            question: 'What hook manages component state?',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswer: 'useState',
            maxScore: 10,
            createdBy: teacher1!.id,
        },
        {
            assignmentId: assignments[1].id,
            type: AssignmentItemType.ESSAY,
            question: 'Explain useEffect dependency array',
            maxScore: 20,
            createdBy: teacher1!.id,
        },
        {
            assignmentId: assignments[1].id,
            type: AssignmentItemType.PROJECT,
            question: 'Submit your React components code',
            maxScore: 30,
            createdBy: teacher1!.id,
        },

        // E-Commerce Project Rubric (5 criteria)
        ...[
            { question: 'UI/UX Design (25%)', maxScore: 25 },
            { question: 'Functionality (30%)', maxScore: 30 },
            { question: 'Code Quality (20%)', maxScore: 20 },
            { question: 'Deployment (15%)', maxScore: 15 },
            { question: 'Documentation (10%)', maxScore: 10 },
        ].map(item => ({
            assignmentId: assignments[2].id,
            type: AssignmentItemType.ESSAY,
            question: item.question,
            maxScore: item.maxScore,
            createdBy: teacher1!.id,
        })),

        // Data Science Assignment (8 items)
        ...[
            { question: 'Data cleaning steps', maxScore: 15 },
            { question: 'Pandas groupby analysis', maxScore: 20 },
            { question: 'Submit your Jupyter notebook', maxScore: 25 },
            { question: 'Visualization quality', maxScore: 20 },
            { question: 'Statistical insights', maxScore: 20 },
        ].map(item => ({
            assignmentId: assignments[3].id,
            type: AssignmentItemType.ESSAY,
            question: item.question,
            maxScore: item.maxScore,
            createdBy: teacher2!.id,
        })),
    ]

    await prisma.assignmentItem.createMany({
        data: assignmentItemsData,
    })

    // 9. Create Course Mappings & SES
    await prisma.courseMapping.createMany({
        data: [
            { enrollmentId: 1, courseId: webDevCourses[0].id, progress: 100 },
            { enrollmentId: 1, courseId: webDevCourses[1].id, progress: 60 },
            { enrollmentId: 2, courseId: webDevCourses[0].id, progress: 80 },
        ],
    })

    await prisma.sES.create({
        data: {
            enrollmentId: 1,
            sessionId: sessions[1].id,
            score: 92,
            scoredBy: teacher1!.id,
            scoredAt: new Date(),
        },
    })

    console.log('✅ Extended seed completed!')
    console.log(`📊 ${userData.length} users, 2 classes`)
    console.log(`📊 ${webDevCourses.length + dataScienceCourses.length} courses, ${sessions.length} sessions`)
    console.log(`📊 5 enrollments, ${assignments.length} assignments, ${assignmentItemsData.length} assignment items`)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
