-- Create FlowResult Table (one result per session, replaced on re-chat)
CREATE TABLE IF NOT EXISTS "FlowResult" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "diagrams" JSONB NOT NULL DEFAULT '{}',
    "audit" JSONB NOT NULL DEFAULT '{}',
    "schema" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowResult_pkey" PRIMARY KEY ("id")
);

-- One result per session
CREATE UNIQUE INDEX IF NOT EXISTS "FlowResult_sessionId_key" ON "FlowResult"("sessionId");

-- Foreign Key to FlowSession
ALTER TABLE "FlowResult" DROP CONSTRAINT IF EXISTS "FlowResult_sessionId_fkey";
ALTER TABLE "FlowResult" ADD CONSTRAINT "FlowResult_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "FlowSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
