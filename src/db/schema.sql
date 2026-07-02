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
