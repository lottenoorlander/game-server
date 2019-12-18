const { Router } = require("express");
const Gameroom = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

function factory(stream) {
  const router = new Router();

  router.put("/join", auth, async (req, res, next) => {
    try {
      const user = await User.update(
        {
          gameroomId: req.body.gameroomId //how we want to update
        },
        {
          where: {
            id: req.user.userId //which user to update
          }
        }
      );

      const everything = await Gameroom.findAll({ include: [User] });

      const action = {
        type: "ALL_GAMEROOMS",
        payload: everything
      };

      const string = JSON.stringify(action);

      stream.send(string);
      res.send(user);
    } catch (error) {
      error(next);
    }
  });

  router.post("/gameroom", async (req, res, next) => {
    try {
      const gameroom = await Gameroom.create(req.body);

      const action = {
        type: "NEW_GAMEROOM",
        payload: gameroom
      };

      const string = JSON.stringify(action);

      stream.send(string);

      res.send(gameroom); //just to stop it from breaking
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = factory;
