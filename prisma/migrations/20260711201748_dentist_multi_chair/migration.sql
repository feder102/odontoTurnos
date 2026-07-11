-- CreateTable
CREATE TABLE "_DentistChairs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DentistChairs_A_fkey" FOREIGN KEY ("A") REFERENCES "Chair" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DentistChairs_B_fkey" FOREIGN KEY ("B") REFERENCES "Dentist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_DentistChairs_AB_unique" ON "_DentistChairs"("A", "B");

-- CreateIndex
CREATE INDEX "_DentistChairs_B_index" ON "_DentistChairs"("B");

-- Backfill: el sillón por defecto de cada odontólogo pasa a ser también
-- su primer sillón asignado (antes solo existía ese único vínculo).
INSERT INTO "_DentistChairs" ("A", "B")
SELECT "defaultChairId", "id" FROM "Dentist" WHERE "defaultChairId" IS NOT NULL;
