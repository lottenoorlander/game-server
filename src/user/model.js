const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  userName: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  position: { type: Sequelize.ARRAY(Sequelize.INTEGER) },
  orientation: { type: Sequelize.STRING },
  lives: { type: Sequelize.INTEGER, defaultValue: 3 },
  flags: { type: Sequelize.INTEGER, defaultValue: 0 },
  ready: { type: Sequelize.BOOLEAN, defaultValue: false },
  turn: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  startposition: { type: Sequelize.ARRAY(Sequelize.INTEGER) }
});

module.exports = User;
