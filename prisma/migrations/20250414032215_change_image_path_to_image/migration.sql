/*
  Warnings:

  - You are about to drop the column `image_path` on the `boat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `boat` DROP COLUMN `image_path`,
    ADD COLUMN `image` VARCHAR(255) NULL;
