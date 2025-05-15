-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_type` ENUM('pending', 'incoming', 'outgoing', 'failed') NOT NULL;
