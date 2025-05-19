/*
  Warnings:

  - Added the required column `topup_status` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `topup_status` ENUM('success', 'failed') NOT NULL;
