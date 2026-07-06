CREATE TABLE IF NOT EXISTS bills (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(250) NOT NULL,
  amount      NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  category    VARCHAR(100) DEFAULT 'general',
  bill_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bills_bill_date ON bills(bill_date);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_name
ON users(name);

CREATE INDEX IF NOT EXISTS idx_users_phone
ON users(phone);

CREATE INDEX IF NOT EXISTS idx_users_status
ON users(status);

CREATE INDEX IF NOT EXISTS idx_users_created_at
ON users(created_at);


CREATE TABLE IF NOT EXISTS food_entries (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_date        DATE NOT NULL,

    morning_meal      VARCHAR(255),
    morning_price     NUMERIC(10,2) DEFAULT 0,

    afternoon_meal    VARCHAR(255),
    afternoon_price   NUMERIC(10,2) DEFAULT 0,

    night_meal        VARCHAR(255),
    night_price       NUMERIC(10,2) DEFAULT 0,

    total_price       NUMERIC(10,2) NOT NULL DEFAULT 0,

    notes             VARCHAR(500),

    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_user_date UNIQUE (user_id, entry_date)
);

CREATE INDEX idx_food_entries_user_date ON food_entries(user_id, entry_date DESC);