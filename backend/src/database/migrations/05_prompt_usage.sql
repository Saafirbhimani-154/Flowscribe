-- Create PromptUsage Table
CREATE TABLE IF NOT EXISTS "PromptUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptUsage_pkey" PRIMARY KEY ("id")
);

-- Create Unique Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "PromptUsage_userId_date_key" ON "PromptUsage"("userId", "date");

-- Add Foreign Key (idempotent)
ALTER TABLE "PromptUsage" DROP CONSTRAINT IF EXISTS "PromptUsage_userId_fkey";
ALTER TABLE "PromptUsage" ADD CONSTRAINT "PromptUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
