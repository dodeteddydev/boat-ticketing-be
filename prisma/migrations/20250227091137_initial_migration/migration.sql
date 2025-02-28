-- CreateTable
CREATE TABLE `country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country_name` VARCHAR(100) NOT NULL,
    `country_code` VARCHAR(100) NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `province` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `province_name` VARCHAR(100) NOT NULL,
    `province_code` VARCHAR(100) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_name` VARCHAR(100) NOT NULL,
    `city_code` VARCHAR(100) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `province_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('superadmin', 'boatowner', 'boatadmin', 'customer') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM('verified', 'unverified') NOT NULL,
    `created_by_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `user_id` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `wallet_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wallet_id` INTEGER NOT NULL,
    `transaction_type` ENUM('incoming', 'outgoing') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(100) NOT NULL,
    `category_code` VARCHAR(100) NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boat_name` VARCHAR(100) NOT NULL,
    `boat_code` VARCHAR(100) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `port` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `port_name` VARCHAR(100) NOT NULL,
    `port_code` VARCHAR(100) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `province_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedule` DATETIME(3) NOT NULL,
    `seat` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `markup_price` DOUBLE NOT NULL,
    `boat_id` INTEGER NOT NULL,
    `arrival_id` INTEGER NOT NULL,
    `departure_id` INTEGER NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedule_id` INTEGER NOT NULL,
    `booking_number` VARCHAR(50) NOT NULL,
    `passenger_name` VARCHAR(100) NOT NULL,
    `id_type` ENUM('ktp', 'passport') NOT NULL,
    `id_number` VARCHAR(50) NOT NULL,
    `country_id` INTEGER NOT NULL,
    `province_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `booking_status` ENUM('pending', 'paid', 'expired') NOT NULL,
    `created_by_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `country` ADD CONSTRAINT `country_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `province` ADD CONSTRAINT `province_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `province` ADD CONSTRAINT `province_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `city_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet` ADD CONSTRAINT `wallet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boat` ADD CONSTRAINT `boat_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boat` ADD CONSTRAINT `boat_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `port` ADD CONSTRAINT `port_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `port` ADD CONSTRAINT `port_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `port` ADD CONSTRAINT `port_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `port` ADD CONSTRAINT `port_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_boat_id_fkey` FOREIGN KEY (`boat_id`) REFERENCES `boat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_arrival_id_fkey` FOREIGN KEY (`arrival_id`) REFERENCES `port`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_departure_id_fkey` FOREIGN KEY (`departure_id`) REFERENCES `port`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `province`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
