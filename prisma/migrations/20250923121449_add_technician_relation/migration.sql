/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('MEMBER', 'SHOP', 'TECHNICIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."RepairStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_CONFIRM', 'COMPLETED', 'SHIPPED', 'CLOSED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "phone" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "public"."RepairRequest" (
    "id" SERIAL NOT NULL,
    "printerModel" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "address" TEXT,
    "issueDesc" TEXT NOT NULL,
    "accessories" TEXT,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactInfo" TEXT,
    "status" "public"."RepairStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RepairImage" (
    "id" SERIAL NOT NULL,
    "repairRequestId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepairImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RepairDetail" (
    "id" SERIAL NOT NULL,
    "repairRequestId" INTEGER NOT NULL,
    "notes" TEXT,
    "technicianId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RepairPart" (
    "id" SERIAL NOT NULL,
    "detailId" INTEGER NOT NULL,
    "partName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RepairPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shipping" (
    "id" SERIAL NOT NULL,
    "repairRequestId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CloseRepair" (
    "id" SERIAL NOT NULL,
    "repairRequestId" INTEGER NOT NULL,
    "finishedDate" TIMESTAMP(3) NOT NULL,
    "receivedDate" TIMESTAMP(3),
    "receiptUrl" TEXT,

    CONSTRAINT "CloseRepair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepairDetail_repairRequestId_key" ON "public"."RepairDetail"("repairRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_repairRequestId_key" ON "public"."Shipping"("repairRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "CloseRepair_repairRequestId_key" ON "public"."CloseRepair"("repairRequestId");

-- AddForeignKey
ALTER TABLE "public"."RepairRequest" ADD CONSTRAINT "RepairRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairImage" ADD CONSTRAINT "RepairImage_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "public"."RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairDetail" ADD CONSTRAINT "RepairDetail_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "public"."RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairDetail" ADD CONSTRAINT "RepairDetail_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairPart" ADD CONSTRAINT "RepairPart_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "public"."RepairDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipping" ADD CONSTRAINT "Shipping_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "public"."RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CloseRepair" ADD CONSTRAINT "CloseRepair_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "public"."RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
