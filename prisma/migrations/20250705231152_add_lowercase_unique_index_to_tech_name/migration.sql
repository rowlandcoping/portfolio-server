CREATE UNIQUE INDEX IF NOT EXISTS tech_name_lower_idx ON "Tech" (LOWER(name));
CREATE UNIQUE INDEX IF NOT EXISTS ecosystem_name_lower_idx ON "Ecosystem" (LOWER(name));
