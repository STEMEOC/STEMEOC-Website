-- CreateIndex
CREATE INDEX "NewsPost_authorId_idx" ON "NewsPost"("authorId");

-- CreateIndex
CREATE INDEX "Form_published_createdAt_idx" ON "Form"("published", "createdAt");
