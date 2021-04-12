DROP TABLE IF EXISTS list_contents CASCADE;

CREATE TABLE list_contents (
  id SERIAL PRIMARY KEY NOT NULL,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  widget_id INTEGER REFERENCES widgets(id) ON DELETE CASCADE
);