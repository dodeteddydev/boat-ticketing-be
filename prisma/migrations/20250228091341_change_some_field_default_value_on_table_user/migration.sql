-- AlterTable
ALTER TABLE `country` MODIFY `created_by_id` INTEGER NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true;
