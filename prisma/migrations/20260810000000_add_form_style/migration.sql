-- CreateEnum
CREATE TYPE "FormLayout" AS ENUM ('CLASSIC', 'MINIMAL', 'BOLD');

-- CreateEnum
CREATE TYPE "FormTheme" AS ENUM ('LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#2c80c2',
ADD COLUMN     "layout" "FormLayout" NOT NULL DEFAULT 'CLASSIC',
ADD COLUMN     "theme" "FormTheme" NOT NULL DEFAULT 'LIGHT';
