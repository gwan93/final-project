DROP TABLE IF EXISTS subcategories CASCADE;

CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255)
);