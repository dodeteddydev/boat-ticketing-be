/*
  Warnings:

  - You are about to drop the column `amount_top_up` on the `wallet` table. All the data in the column will be lost.
  - You are about to drop the column `proof_image` on the `wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `amount_transaction` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `proof_image` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `wallet` DROP COLUMN `amount_top_up`,
    DROP COLUMN `proof_image`;
