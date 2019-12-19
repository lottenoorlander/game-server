const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  userName: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  position: { type: Sequelize.Array },
  orientation: { type: Sequelize.STRING },
  lives: { type: Sequelize.STRING, defaultValue: 3 },
  flags: { type: Sequelize.STRING },
  ready: { type: Sequelize.BOOLEAN, defaultValue: false },
  move: { type: Sequelize.ARRAY },
  startposition: { type: Sequelize.STRING }
});

module.exports = User;
