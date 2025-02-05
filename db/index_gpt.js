const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database.db",
});

// Define the Character model
const Character = sequelize.define('Character', {
  unicode_character: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  wanikani_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kakimashou_def: {
    type: DataTypes.TEXT,
  },
  // Add additional fields...
}, {
  tableName: 'characters',
  timestamps: false,
});

// Create an index on the unicode_character field
Character.sync({ alter: true }).then(() => {
  return sequelize.query('CREATE INDEX IF NOT EXISTS idx_unicode_character ON characters (unicode_character);');
});

module.exports = { sequelize, Character };
