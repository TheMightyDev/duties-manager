-- CreateTable
CREATE TABLE "Invitation" (
    "inviteCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "redeemDate" TIMESTAMP(3),

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("inviteCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_userId_key" ON "Invitation"("userId");
