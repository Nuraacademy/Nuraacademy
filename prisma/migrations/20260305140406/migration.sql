-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('PLACEMENT', 'PRETEST', 'POSTTEST', 'ASSIGNMENT', 'EXERCISE', 'PROJECT');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('GROUP', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "AssignmentItemType" AS ENUM ('OBJECTIVE', 'ESSAY', 'PROJECT');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PASS', 'NOT_PASS');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "whatsapp" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "isSynchronous" BOOLEAN,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "schedule" JSONB,
    "reference" JSONB,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imgUrl" TEXT,
    "hours" INTEGER,
    "methods" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "learningObjective" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activity" TEXT NOT NULL,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "learningObjectives" TEXT,
    "entrySkills" TEXT,
    "tools" TEXT,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ses" (
    "enrollmentId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "scoredBy" INTEGER,
    "scoredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ses_pkey" PRIMARY KEY ("enrollmentId","sessionId")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER,
    "courseId" INTEGER,
    "sessionId" INTEGER,
    "type" "AssignmentType" NOT NULL,
    "submissionType" "SubmissionType",
    "duration" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "instruction" TEXT,
    "passingGrade" DOUBLE PRECISION,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_items" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "type" "AssignmentItemType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" TEXT,
    "maxScore" DOUBLE PRECISION,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assignment_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_results" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'NOT_PASS',
    "totalScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assignment_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_item_results" (
    "id" SERIAL NOT NULL,
    "assignmentResultId" INTEGER NOT NULL,
    "assignmentItemId" INTEGER NOT NULL,
    "answer" TEXT,
    "answerFiles" JSONB,
    "score" DOUBLE PRECISION,
    "reviewerFeedback" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assignment_item_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_mappings" (
    "enrollmentId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "progress" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "course_mappings_pkey" PRIMARY KEY ("enrollmentId","courseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "sessions_courseId_idx" ON "sessions"("courseId");

-- CreateIndex
CREATE INDEX "sessions_createdBy_idx" ON "sessions"("createdBy");

-- CreateIndex
CREATE INDEX "classes_createdBy_idx" ON "classes"("createdBy");

-- CreateIndex
CREATE INDEX "classes_isDraft_idx" ON "classes"("isDraft");

-- CreateIndex
CREATE INDEX "classes_startDate_endDate_idx" ON "classes"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "timelines_classId_date_idx" ON "timelines"("classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "timelines_classId_date_key" ON "timelines"("classId", "date");

-- CreateIndex
CREATE INDEX "courses_classId_idx" ON "courses"("classId");

-- CreateIndex
CREATE INDEX "courses_createdBy_idx" ON "courses"("createdBy");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_classId_idx" ON "enrollments"("classId");

-- CreateIndex
CREATE INDEX "enrollments_status_idx" ON "enrollments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_classId_key" ON "enrollments"("userId", "classId");

-- CreateIndex
CREATE INDEX "ses_sessionId_idx" ON "ses"("sessionId");

-- CreateIndex
CREATE INDEX "assignments_classId_idx" ON "assignments"("classId");

-- CreateIndex
CREATE INDEX "assignments_courseId_idx" ON "assignments"("courseId");

-- CreateIndex
CREATE INDEX "assignments_sessionId_idx" ON "assignments"("sessionId");

-- CreateIndex
CREATE INDEX "assignments_type_idx" ON "assignments"("type");

-- CreateIndex
CREATE INDEX "assignments_startDate_endDate_idx" ON "assignments"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "assignment_items_assignmentId_idx" ON "assignment_items"("assignmentId");

-- CreateIndex
CREATE INDEX "assignment_items_type_idx" ON "assignment_items"("type");

-- CreateIndex
CREATE INDEX "assignment_results_assignmentId_idx" ON "assignment_results"("assignmentId");

-- CreateIndex
CREATE INDEX "assignment_results_enrollmentId_idx" ON "assignment_results"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_results_assignmentId_enrollmentId_key" ON "assignment_results"("assignmentId", "enrollmentId");

-- CreateIndex
CREATE INDEX "assignment_item_results_assignmentResultId_idx" ON "assignment_item_results"("assignmentResultId");

-- CreateIndex
CREATE INDEX "assignment_item_results_assignmentItemId_idx" ON "assignment_item_results"("assignmentItemId");

-- CreateIndex
CREATE INDEX "groups_enrollmentId_idx" ON "groups"("enrollmentId");

-- CreateIndex
CREATE INDEX "course_mappings_courseId_idx" ON "course_mappings"("courseId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ses" ADD CONSTRAINT "ses_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ses" ADD CONSTRAINT "ses_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_items" ADD CONSTRAINT "assignment_items_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_results" ADD CONSTRAINT "assignment_results_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_results" ADD CONSTRAINT "assignment_results_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_item_results" ADD CONSTRAINT "assignment_item_results_assignmentResultId_fkey" FOREIGN KEY ("assignmentResultId") REFERENCES "assignment_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_item_results" ADD CONSTRAINT "assignment_item_results_assignmentItemId_fkey" FOREIGN KEY ("assignmentItemId") REFERENCES "assignment_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_mappings" ADD CONSTRAINT "course_mappings_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_mappings" ADD CONSTRAINT "course_mappings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
