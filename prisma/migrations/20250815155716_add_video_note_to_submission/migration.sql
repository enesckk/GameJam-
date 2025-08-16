/*
  Warnings:

  - You are about to drop the column `repoUrl` on the `Submission` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "itchUrl" TEXT,
    "githubUrl" TEXT,
    "buildUrl" TEXT,
    "videoUrl" TEXT,
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("buildUrl", "createdAt", "description", "githubUrl", "id", "itchUrl", "note", "teamId", "title", "updatedAt", "userId", "videoUrl") SELECT "buildUrl", "createdAt", "description", "githubUrl", "id", "itchUrl", "note", "teamId", "title", "updatedAt", "userId", "videoUrl" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
