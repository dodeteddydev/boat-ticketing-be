/*
  Warnings:

  - The values [pending,failed] on the enum `transaction_transaction_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_type` ENUM('incoming', 'outgoing') NOT NULL,
    MODIFY `topup_status` ENUM('pending', 'success', 'failed') NOT NULL;
