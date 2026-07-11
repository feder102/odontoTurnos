-- CreateTable
CREATE TABLE "TimeOff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dentistId" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeOff_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "Dentist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TimeOff_dentistId_idx" ON "TimeOff"("dentistId");

-- CreateIndex
CREATE INDEX "TimeOff_startDate_endDate_idx" ON "TimeOff"("startDate", "endDate");
