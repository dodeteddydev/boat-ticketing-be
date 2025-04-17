-- AlterTable
ALTER TABLE `booking` MODIFY `booking_status` ENUM('pending', 'paid', 'expired') NOT NULL DEFAULT 'pending';
