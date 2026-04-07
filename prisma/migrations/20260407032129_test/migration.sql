-- CreateEnum
CREATE TYPE "DiscussionType" AS ENUM ('TECHNICAL_HELP', 'LEARNING_RESOURCE', 'LEARNING_PARTNER', 'COURSE_DISCUSSION', 'CAREER_PORTOS');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('COURSE', 'FINAL_PROJECT');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('SESSION', 'EXERCISE', 'ASSIGNMENT');

-- AlterTable
ALTER TABLE "assignment_items" ADD COLUMN     "courseId" INTEGER,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "assignment_results" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "feedbackFiles" JSONB,
ADD COLUMN     "problemUnderstanding" INTEGER DEFAULT 0,
ADD COLUMN     "problemUnderstandingFeedback" TEXT,
ADD COLUMN     "solutionQuality" INTEGER DEFAULT 0,
ADD COLUMN     "solutionQualityFeedback" TEXT,
ADD COLUMN     "technicalAbility" INTEGER DEFAULT 0,
ADD COLUMN     "technicalAbilityFeedback" TEXT;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "capacity" INTEGER DEFAULT 100,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "modules" INTEGER,
ADD COLUMN     "previewVideoUrl" TEXT,
ADD COLUMN     "trainerId" INTEGER;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "threshold" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'COURSE';

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "educationField" TEXT,
ADD COLUMN     "finalExpectations" TEXT,
ADD COLUMN     "jobIndustry" TEXT,
ADD COLUMN     "objectives" TEXT[],
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "workField" TEXT,
ADD COLUMN     "yoe" TEXT;

-- AlterTable
ALTER TABLE "ses" ADD COLUMN     "status" TEXT DEFAULT 'absent';

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "type" "SessionType" NOT NULL DEFAULT 'SESSION';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "curricula" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "curricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflections" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER,
    "enrollmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "courseId" INTEGER,

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "reflectionId" INTEGER,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "DiscussionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_replies" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "discussion_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_likes" (
    "discussionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_likes_pkey" PRIMARY KEY ("discussionId","userId")
);

-- CreateTable
CREATE TABLE "discussion_reply_likes" (
    "replyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_reply_likes_pkey" PRIMARY KEY ("replyId","userId")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "type" TEXT DEFAULT 'General',
    "author" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_views" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_comments" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_likes" (
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_likes_pkey" PRIMARY KEY ("blogId","userId")
);

-- CreateTable
CREATE TABLE "learner_analytics" (
    "id" SERIAL NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "cooperationScore" DOUBLE PRECISION,
    "cooperationFeedback" TEXT,
    "attendanceScore" DOUBLE PRECISION,
    "attendanceFeedback" TEXT,
    "taskCompletionScore" DOUBLE PRECISION,
    "taskCompletionFeedback" TEXT,
    "initiativesScore" DOUBLE PRECISION,
    "initiativesFeedback" TEXT,
    "communicationScore" DOUBLE PRECISION,
    "communicationFeedback" TEXT,
    "problemUnderstandingScore" DOUBLE PRECISION,
    "dataReasoningScore" DOUBLE PRECISION,
    "methodsScore" DOUBLE PRECISION,
    "insightQualityScore" DOUBLE PRECISION,
    "solutionQualityScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peer_feedback" (
    "id" SERIAL NOT NULL,
    "evaluatorId" INTEGER NOT NULL,
    "evaluateeId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "cooperation" INTEGER DEFAULT 0,
    "attendance" INTEGER DEFAULT 0,
    "taskCompletion" INTEGER DEFAULT 0,
    "initiatives" INTEGER DEFAULT 0,
    "communication" INTEGER DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attendanceFeedback" TEXT,
    "communicationFeedback" TEXT,
    "cooperationFeedback" TEXT,
    "initiativesFeedback" TEXT,
    "taskCompletionFeedback" TEXT,

    CONSTRAINT "peer_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_feedback" (
    "id" SERIAL NOT NULL,
    "evaluatorId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "engagement" INTEGER DEFAULT 0,
    "engagementFeedback" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "communication" INTEGER DEFAULT 0,
    "communicationFeedback" TEXT,
    "mastery" INTEGER DEFAULT 0,
    "masteryFeedback" TEXT,
    "motivation" INTEGER DEFAULT 0,
    "motivationFeedback" TEXT,
    "responsiveness" INTEGER DEFAULT 0,
    "responsivenessFeedback" TEXT,

    CONSTRAINT "trainer_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_feedbacks" (
    "id" SERIAL NOT NULL,
    "classId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "courseStructure" INTEGER DEFAULT 0,
    "courseStructureFeedback" TEXT,
    "learningEnvironment" INTEGER DEFAULT 0,
    "learningEnvironmentFeedback" TEXT,
    "materialQuality" INTEGER DEFAULT 0,
    "materialQualityFeedback" TEXT,
    "practicalRelevance" INTEGER DEFAULT 0,
    "practicalRelevanceFeedback" TEXT,
    "technicalSupport" INTEGER DEFAULT 0,
    "technicalSupportFeedback" TEXT,

    CONSTRAINT "class_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassCurricula" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassCurricula_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "reflections_sessionId_idx" ON "reflections"("sessionId");

-- CreateIndex
CREATE INDEX "reflections_courseId_idx" ON "reflections"("courseId");

-- CreateIndex
CREATE INDEX "reflections_enrollmentId_idx" ON "reflections"("enrollmentId");

-- CreateIndex
CREATE INDEX "reflections_userId_idx" ON "reflections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reflections_userId_sessionId_key" ON "reflections"("userId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "reflections_userId_courseId_key" ON "reflections"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_reflectionId_key" ON "feedbacks"("reflectionId");

-- CreateIndex
CREATE INDEX "feedbacks_reflectionId_idx" ON "feedbacks"("reflectionId");

-- CreateIndex
CREATE INDEX "feedbacks_userId_idx" ON "feedbacks"("userId");

-- CreateIndex
CREATE INDEX "discussions_userId_idx" ON "discussions"("userId");

-- CreateIndex
CREATE INDEX "discussions_type_idx" ON "discussions"("type");

-- CreateIndex
CREATE INDEX "discussion_replies_discussionId_idx" ON "discussion_replies"("discussionId");

-- CreateIndex
CREATE INDEX "discussion_replies_userId_idx" ON "discussion_replies"("userId");

-- CreateIndex
CREATE INDEX "discussion_likes_userId_idx" ON "discussion_likes"("userId");

-- CreateIndex
CREATE INDEX "discussion_reply_likes_userId_idx" ON "discussion_reply_likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "blog_views_blogId_idx" ON "blog_views"("blogId");

-- CreateIndex
CREATE UNIQUE INDEX "learner_analytics_enrollmentId_key" ON "learner_analytics"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "peer_feedback_evaluatorId_evaluateeId_classId_key" ON "peer_feedback"("evaluatorId", "evaluateeId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_feedback_evaluatorId_trainerId_classId_key" ON "trainer_feedback"("evaluatorId", "trainerId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "class_feedbacks_userId_classId_key" ON "class_feedbacks"("userId", "classId");

-- CreateIndex
CREATE INDEX "_ClassCurricula_B_index" ON "_ClassCurricula"("B");

-- CreateIndex
CREATE INDEX "assignment_items_courseId_idx" ON "assignment_items"("courseId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_reflectionId_fkey" FOREIGN KEY ("reflectionId") REFERENCES "reflections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_items" ADD CONSTRAINT "assignment_items_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_likes" ADD CONSTRAINT "discussion_likes_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_likes" ADD CONSTRAINT "discussion_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply_likes" ADD CONSTRAINT "discussion_reply_likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "discussion_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply_likes" ADD CONSTRAINT "discussion_reply_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_views" ADD CONSTRAINT "blog_views_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_analytics" ADD CONSTRAINT "learner_analytics_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_feedback" ADD CONSTRAINT "peer_feedback_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_feedback" ADD CONSTRAINT "peer_feedback_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_feedback" ADD CONSTRAINT "peer_feedback_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_feedback" ADD CONSTRAINT "trainer_feedback_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_feedback" ADD CONSTRAINT "trainer_feedback_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_feedback" ADD CONSTRAINT "trainer_feedback_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_feedbacks" ADD CONSTRAINT "class_feedbacks_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_feedbacks" ADD CONSTRAINT "class_feedbacks_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_feedbacks" ADD CONSTRAINT "class_feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCurricula" ADD CONSTRAINT "_ClassCurricula_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCurricula" ADD CONSTRAINT "_ClassCurricula_B_fkey" FOREIGN KEY ("B") REFERENCES "curricula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
