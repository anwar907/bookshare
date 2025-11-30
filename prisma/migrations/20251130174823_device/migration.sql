/*
  Warnings:

  - You are about to drop the column `deviceId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `deviceId`,
    DROP COLUMN `token`,
    MODIFY `updatedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `userDevice` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(100) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(191) NOT NULL,
    `expire_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userDevice` ADD CONSTRAINT `userDevice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
