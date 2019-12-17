const Sequelize = require("sequelize");
const db = require("../db");

const Gameroom = db.define("gameroom", {
  name: Sequelize.STRING
});

module.exports = Gameroom;
