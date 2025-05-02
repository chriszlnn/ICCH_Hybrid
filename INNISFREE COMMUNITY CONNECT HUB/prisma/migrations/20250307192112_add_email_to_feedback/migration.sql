-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "department" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "department" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "issues" TEXT[],
    "comment" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
