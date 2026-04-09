-- CreateTable
CREATE TABLE "_ClassTrainers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ClassTrainers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClassTrainers_B_index" ON "_ClassTrainers"("B");

-- AddForeignKey
ALTER TABLE "_ClassTrainers" ADD CONSTRAINT "_ClassTrainers_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassTrainers" ADD CONSTRAINT "_ClassTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
