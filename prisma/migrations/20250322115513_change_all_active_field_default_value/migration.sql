/*
  Warnings:

  - Made the column `created_by_id` on table `country` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `country` DROP FOREIGN KEY `country_created_by_id_fkey`;

-- DropIndex
DROP INDEX `country_created_by_id_fkey` ON `country`;

-- AlterTable
ALTER TABLE `boat` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `booking` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `category` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `city` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `country` MODIFY `created_by_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `port` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `schedule` MODIFY `active` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `country` ADD CONSTRAINT `country_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
