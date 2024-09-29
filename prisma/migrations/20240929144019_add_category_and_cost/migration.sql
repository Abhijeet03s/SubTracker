/*
  Warnings:

  - You are about to drop the column `reminderCreated` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `category` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "reminderCreated",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL;
