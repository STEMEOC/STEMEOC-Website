-- CreateTable
CREATE TABLE "EventDataset" (
    "key" TEXT NOT NULL,
    "rows" JSONB NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventDataset_pkey" PRIMARY KEY ("key")
);
