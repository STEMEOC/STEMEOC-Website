-- Removed questions are archived instead of deleted, so their answers stay readable.
ALTER TABLE "FormField" ADD COLUMN "archivedAt" TIMESTAMP(3);
