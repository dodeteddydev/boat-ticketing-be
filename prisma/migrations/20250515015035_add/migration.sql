-- AlterTable
ALTER TABLE `transaction` MODIFY `transaction_type` ENUM('pending', 'failed', 'incoming', 'outgoing') NOT NULL;

-- AlterTable
ALTER TABLE `wallet` ADD COLUMN `amount_top_up` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `amount` DOUBLE NOT NULL DEFAULT 0;
