const { Character } = require("./index");
const fs = require("node:fs");
const path = require("node:path");

const loadData = async () => {
  const jsonPath = path.join("..", "data", "all_character_data.json");
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  for (data in jsonData) {
    await Character.create({character: data, ...jsonData[data]});
  }
}

loadData();