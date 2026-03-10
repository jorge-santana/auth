/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `password_reset_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_user_id_key" ON "password_reset_tokens"("user_id");
