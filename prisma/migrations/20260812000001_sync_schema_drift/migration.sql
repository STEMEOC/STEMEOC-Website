-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FormLayout" ADD VALUE 'COVER';
ALTER TYPE "FormLayout" ADD VALUE 'SIDEBAR';
ALTER TYPE "FormLayout" ADD VALUE 'DUOTONE';
ALTER TYPE "FormLayout" ADD VALUE 'FRAMED';
ALTER TYPE "FormLayout" ADD VALUE 'BADGE';

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "coverImageUrl" TEXT;

-- AlterTable
ALTER TABLE "NewsPost" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'News';

-- CreateTable
CREATE TABLE "PodcastEpisode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PodcastEpisode_published_order_idx" ON "PodcastEpisode"("published", "order");
