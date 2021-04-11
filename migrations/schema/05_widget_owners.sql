DROP TABLE IF EXISTS widget_owners CASCADE;

CREATE TABLE widget_owners (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
  widget_id INTEGER REFERENCES widget(id) ON DELETE CASCADE,
  date_purchased DATE,
  bought_for_price_cents INTEGER
);