-- CreateTable
CREATE TABLE "group_summaries" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "groupName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "submittedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "group_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_summaries_sessionId_groupName_key" ON "group_summaries"("sessionId", "groupName");

-- AddForeignKey
ALTER TABLE "group_summaries" ADD CONSTRAINT "group_summaries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_summaries" ADD CONSTRAINT "group_summaries_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
