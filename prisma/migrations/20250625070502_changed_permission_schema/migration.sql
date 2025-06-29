/*
  Warnings:

  - You are about to drop the column `action` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `permission` DROP COLUMN `action`,
    DROP COLUMN `resource`;
