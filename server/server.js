require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "client", "dist")));
const indexPath = path.join(__dirname, "../client/dist/index.html");
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

const HOST = process.env.HOST
const PORT = process.env.PORT
const URL = process.env.URL
app.listen(PORT, '0.0.0.0', () => {
  console.log(``);
  console.log(`-------------------------------`)
  console.log(`Name:        Noted`);
  console.log(`Version:     4.0.0`)
  console.log(`Author:      Alex Pariah`);
  console.log(`-------------------------------`);
  console.log(`SERVER INFO`);
  console.log(``)
  console.log(`  Status:    LIVE`);
  console.log(`  Local :    ${HOST}:${PORT}`);
  console.log(`  Public:    ${URL}`);
  console.log(`-------------------------------`);
  console.log(`Console:`);
});