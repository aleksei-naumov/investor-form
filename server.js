const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5005;

const CLIENT_BUILD = path.join(__dirname, "frontend", "build");
app.use(express.static(CLIENT_BUILD));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(CLIENT_BUILD, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
