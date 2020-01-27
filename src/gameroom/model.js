const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Gameroom = db.define("gameroom", {
  name: Sequelize.STRING,
  phase: { type: Sequelize.STRING, defaultValue: "WAITING_TO_START" }
});

User.belongsTo(Gameroom);
Gameroom.hasMany(User);

module.exports = Gameroom;
