/*
  Warnings:

  - A unique constraint covering the columns `[country_code]` on the table `country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[province_code]` on the table `province` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `country_country_code_key` ON `country`(`country_code`);

-- CreateIndex
CREATE UNIQUE INDEX `province_province_code_key` ON `province`(`province_code`);
