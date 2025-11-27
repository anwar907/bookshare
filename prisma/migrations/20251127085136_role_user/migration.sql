/*
  Warnings:

  - Added the required column `role` to the `admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `role` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `role` VARCHAR(100) NOT NULL;
