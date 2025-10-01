CREATE OR REPLACE FUNCTION update_related_names()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Skill"
  SET "name" = NEW.name
  WHERE "ecoId" = NEW.id;

  UPDATE "ProjectEcosystem"
  SET "name" = NEW.name
  WHERE "ecoId" = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ecosystem_name_update
AFTER UPDATE OF name ON "Ecosystem"
FOR EACH ROW
EXECUTE FUNCTION update_related_names();
