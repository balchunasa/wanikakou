const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db"
});

const Character = sequelize.define(
  "Character",
  {
    character: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    character_paths: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    drawing_paths: {
      type: DataTypes.JSON,
      allowNull: false
    },
    kakimashou_def: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kakimashou_readings: {
      type: DataTypes.JSON,
      allowNull: false
    },
    kakimashou_popular_readings: {
      type: DataTypes.JSON,
      allowNull: false
    },
    wanikani_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wanikani_meanings: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        fields: ["character"]
      }
    ],
    timestamps: false
  }
);

// IIFE to create the table
(async () => {
  await sequelize.sync();
})();

module.exports = { sequelize, Character };