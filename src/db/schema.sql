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