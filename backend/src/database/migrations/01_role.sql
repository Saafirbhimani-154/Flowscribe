-- Create Role Table
CREATE TABLE IF NOT EXISTS "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- Create Unique Index
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name");
