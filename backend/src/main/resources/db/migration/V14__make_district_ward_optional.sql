-- Make district and ward optional in user_addresses table
ALTER TABLE user_addresses ALTER COLUMN district DROP NOT NULL;
ALTER TABLE user_addresses ALTER COLUMN ward DROP NOT NULL;
