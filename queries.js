const CREATE_INVESTORS_TABLE = `
  CREATE TABLE IF NOT EXISTS investors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    phone_number  TEXT NOT NULL,
    street_address TEXT NOT NULL,
    state      TEXT NOT NULL,
    zip_code   TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`;

const CREATE_DOCUMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investor_id INTEGER NOT NULL,
    filename     TEXT NOT NULL,
    original_name TEXT NOT NULL,
    uploaded_at  TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(investor_id) REFERENCES investors(id)
  )`;

const INSERT_INVESTOR = `
  INSERT INTO investors (
    first_name, last_name, date_of_birth, phone_number,
    street_address, state, zip_code
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const INSERT_DOCUMENT = `
  INSERT INTO documents (
    investor_id, filename, original_name
  ) VALUES (?, ?, ?)
`;

module.exports = {
  CREATE_INVESTORS_TABLE,
  CREATE_DOCUMENTS_TABLE,
  INSERT_INVESTOR,
  INSERT_DOCUMENT,
};
