const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const {
  CREATE_INVESTORS_TABLE,
  CREATE_DOCUMENTS_TABLE,
  INSERT_INVESTOR,
  INSERT_DOCUMENT,
} = require("./queries");

const app = express();
const PORT = process.env.PORT || 5005;

const UPLOAD_DIR = path.join(__dirname, "uploaded_files");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } });
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("DB error", err);
});

db.serialize(() => {
  db.run(CREATE_INVESTORS_TABLE);
  db.run(CREATE_DOCUMENTS_TABLE);
});

app.use(express.urlencoded({ extended: true }));
app.use("/uploaded_files", express.static(UPLOAD_DIR));

const CLIENT_BUILD = path.join(__dirname, "frontend", "build");
app.use(express.static(CLIENT_BUILD));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
