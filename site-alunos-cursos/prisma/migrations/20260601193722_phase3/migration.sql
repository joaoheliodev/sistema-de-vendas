-- AlterTable
ALTER TABLE "CourseAccess" ADD COLUMN     "lastAccess" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;
