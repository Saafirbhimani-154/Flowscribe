-- Create FlowMessage Table (conversation thread within a session)
CREATE TABLE IF NOT EXISTS "FlowMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowMessage_pkey" PRIMARY KEY ("id")
);

-- Index for fast message lookups per session
CREATE INDEX IF NOT EXISTS "FlowMessage_sessionId_idx" ON "FlowMessage"("sessionId");

-- Foreign Key to FlowSession
ALTER TABLE "FlowMessage" DROP CONSTRAINT IF EXISTS "FlowMessage_sessionId_fkey";
ALTER TABLE "FlowMessage" ADD CONSTRAINT "FlowMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "FlowSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
