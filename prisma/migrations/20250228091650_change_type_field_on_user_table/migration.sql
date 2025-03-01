-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('verified', 'unverified') NOT NULL DEFAULT 'unverified',
    MODIFY `active` BOOLEAN NOT NULL DEFAULT true;
