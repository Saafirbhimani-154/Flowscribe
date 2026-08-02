-- Create FlowSession Table
CREATE TABLE IF NOT EXISTS "FlowSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Flow',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowSession_pkey" PRIMARY KEY ("id")
);

-- Index for fast user session lookups
CREATE INDEX IF NOT EXISTS "FlowSession_userId_idx" ON "FlowSession"("userId");

-- Foreign Key to User
ALTER TABLE "FlowSession" DROP CONSTRAINT IF EXISTS "FlowSession_userId_fkey";
ALTER TABLE "FlowSession" ADD CONSTRAINT "FlowSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
