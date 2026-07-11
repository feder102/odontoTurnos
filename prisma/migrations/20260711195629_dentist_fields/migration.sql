-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dentist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "specialty" TEXT NOT NULL DEFAULT 'GENERAL',
    "color" TEXT NOT NULL DEFAULT '#0ea5e9',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "license" TEXT,
    "hiredAt" DATETIME,
    "photoUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "defaultChairId" TEXT,
    CONSTRAINT "Dentist_defaultChairId_fkey" FOREIGN KEY ("defaultChairId") REFERENCES "Chair" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Dentist" ("active", "color", "defaultChairId", "id", "name", "specialty") SELECT "active", "color", "defaultChairId", "id", "name", "specialty" FROM "Dentist";
DROP TABLE "Dentist";
ALTER TABLE "new_Dentist" RENAME TO "Dentist";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
