const { Character } = require("./index");

const searchChar = "丈";

const getData = async () => {
  let character = await Character.findOne({ where: {character: searchChar}} );
  
  console.log(character.dataValues);
}

getData();