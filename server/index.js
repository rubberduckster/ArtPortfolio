const express = require("express");
const fs = require("fs");

const app = express();

app.listen(8080, () => console.log("Running webserver!"));

app.get("/api/drawingthemes", async (req,res) => {
  const data = JSON.parse(await fs.promises.readFile("./data/drawingthemes.json","utf8"));

  res.send(data);
})

app.use(express.static("../client"));