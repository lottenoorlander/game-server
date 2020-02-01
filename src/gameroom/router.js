const { Router } = require("express");
const Gameroom = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

async function executeTurnCheckWinOrLoss(firstUser, secondUser) {
  const firstMove = await movement(firstUser);
  const firstCheckOnBoardPosition = await checkForColisionOrFlag(
    firstUser,
    secondUser
  );
  const updatedfirstUser = await User.findOne({ where: { id: firstUser.id } });
  const secondMove = await movement(secondUser);
  const secondCheckOnBoardPosition = await checkForColisionOrFlag(
    secondUser,
    updatedfirstUser
  );

  const WinOrLoss = await checkWinOrLoss(firstUser, secondUser);
}

async function checkWinOrLoss(firstUser, secondUser) {
  // const gameroom = await Gameroom.findOne(
  //   { where: { id: firstUser.gameroomId } },
  //   { include: [User] }
  // );
  // const player1 = gameroom.users[0];
  // const player2 = gameroom.users[1];

  const player1 = await User.findOne({ where: { id: firstUser.id } });
  const player2 = await User.findOne({ where: { id: secondUser.id } });

  if (
    player1.flags === 3 ||
    player2.flags === 3 ||
    player1.lives <= 0 ||
    player2.lives <= 0
  ) {
    const endGameroomPhase = await Gameroom.update(
      { phase: "END_OF_GAME" },
      { where: { id: firstUser.gameroomId } }
    );
  } else {
    const updateGameroomPhase = await Gameroom.update(
      { phase: "START_TURN" },
      { where: { id: firstUser.gameroomId } }
    );
  }
}

async function checkForColisionOrFlag(player, opponent) {
  const updatedPlayer = await User.findOne({ where: { id: player.id } });
  const gameboard = [
    ["tile", "tile", "tile"],
    ["tile", "flag", "tile"],
    ["pit", "tile", "pit"],
    ["tile", "tile", "tile"],
    ["flag", "tile", "tile"],
    ["tile", "pit", "tile"],
    ["tile", "flag", "tile"]
  ];
  if (
    updatedPlayer.position[0] > 7 ||
    updatedPlayer.position[0] <= 0 ||
    updatedPlayer.position[1] > 3 ||
    updatedPlayer.position[1] <= 0
  ) {
    const updatePositionStart = await User.update(
      {
        position: updatedPlayer.startposition
      },
      {
        where: {
          id: updatedPlayer.id
        }
      }
    );
  } else {
    const playerPositionX = updatedPlayer.position[0];
    const playerPositionY = updatedPlayer.position[1];
    const positionOnBoard = gameboard[playerPositionX - 1][playerPositionY - 1];

    if (updatedPlayer.position === opponent.position) {
      const updateOponentHealth = await User.update(
        {
          lives: oponent.lives - 1,
          position: oponent.startposition
        },
        {
          where: {
            id: oponent.id
          }
        }
      );
    } else if (positionOnBoard === "flag") {
      const updateWins = await User.update(
        { flags: updatedPlayer.flags + 1 },
        { where: { id: updatedPlayer.id } }
      );
    } else if (positionOnBoard === "pit") {
      const updatePlayerHealth = await User.update(
        {
          lives: updatedPlayer.lives - 1,
          position: updatedPlayer.startposition
        },
        {
          where: {
            id: updatedPlayer.id
          }
        }
      );
    }
  }
}

async function movement(user) {
  const move = user.turn[1];
  if (move === "oneAhead") {
    const updatePositionUp = await User.update(
      {
        position: [user.position[0] - 1, user.position[1]]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  } else if (move === "twoAhead") {
    const updatePositionUp = await User.update(
      {
        position: [user.position[0] - 2, user.position[1]]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  } else if (move === "fourAhead") {
    const updatePositionUp = await User.update(
      {
        position: [user.position[0] - 4, user.position[1]]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  } else if (move === "back") {
    const updatePositionDown = await User.update(
      {
        position: [user.position[0] + 1, user.position[1]]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  } else if (move === "left") {
    const updatePositionLeft = await User.update(
      {
        position: [user.position[0], user.position[1] - 1]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  } else if (move === "right") {
    const updatePositionRight = await User.update(
      {
        position: [user.position[0], user.position[1] + 1]
      },
      {
        where: {
          id: user.id
        }
      }
    );
  }
}

function factory(stream) {
  const router = new Router();

  router.put("/join", auth, async (req, res, next) => {
    try {
      const user = await User.update(
        {
          gameroomId: req.body.gameroomId
        },
        {
          where: {
            id: req.user.id
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

      res.send(gameroom);
    } catch (error) {
      next(error);
    }
  });

  router.put("/start", auth, async (req, res, next) => {
    try {
      const { user } = req;

      const userReady = await User.update(
        {
          ready: true
        },
        {
          where: {
            id: user.id
          }
        }
      );

      const gameroom = await Gameroom.findByPk(user.gameroomId, {
        include: [User]
      });

      const { users } = gameroom;

      const ready = users.length === 2 && users.every(user => user.ready);
      if (ready) {
        const gameroomPhaseStart = await Gameroom.update(
          {
            phase: "START_TURN"
          },
          {
            where: {
              id: user.gameroomId
            }
          }
        );

        const player2startpos = await User.update(
          {
            startposition: [1, 3],
            position: [1, 3],
            ready: false
          },
          {
            where: {
              id: user.id
            }
          }
        );
        const resetReady = await User.update(
          {
            ready: false
          },
          {
            where: {
              id: gameroom.users[1].id
            }
          }
        );
      } else {
        const player1startpos = await User.update(
          {
            startposition: [1, 1],
            position: [1, 1]
          },
          {
            where: {
              id: user.id
            }
          }
        );
      }

      const everything = await Gameroom.findAll({ include: [User] });

      const action = {
        type: "ALL_GAMEROOMS",
        payload: everything
      };

      const string = JSON.stringify(action);

      stream.send(string);
      res.send(user);
    } catch (error) {
      next(error);
    }
  });

  router.put("/turn", auth, async (req, res, next) => {
    try {
      const requser = await User.update(
        {
          ready: true,
          turn: req.body.turn
        },
        {
          where: {
            id: req.user.id
          }
        }
      );

      const gameroom = await Gameroom.findByPk(req.user.gameroomId, {
        include: [User]
      });
      const { users } = gameroom;

      const ready = users.every(user => user.ready);
      const user1 = gameroom.users[0];
      const user2 = gameroom.users[1];

      if (ready) {
        const changeToExecutePhase = await Gameroom.update(
          { phase: "EXECUTE_TURN" },
          {
            where: {
              id: user1.gameroomId
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

        const order = parseInt(user1.turn[0]) > parseInt(user2.turn[0]);
        if (order) {
          const executeTurnOneTwo = await executeTurnCheckWinOrLoss(
            user1,
            user2
          );
        } else {
          const executeTurnTwoOne = await executeTurnCheckWinOrLoss(
            user2,
            user1
          );
        }
        const gameroomsAfterTurn = await Gameroom.findAll({ include: [User] });

        const action2 = {
          type: "ALL_GAMEROOMS",
          payload: gameroomsAfterTurn
        };

        const string2 = JSON.stringify(action2);

        stream.send(string2);

        if (gameroomsAfterTurn.phase === "END_OF_GAME") {
          const resetPlayer1 = await User.update(
            {
              ready: false,
              turn: null,
              lives: 3,
              flags: 0,
              position: null,
              startposition: null
            },
            {
              where: {
                id: user1.id
              }
            }
          );
          const resetPlayer2 = await User.update(
            {
              ready: false,
              turn: null,
              lives: 3,
              flags: 0,
              position: null,
              startposition: null
            },
            {
              where: {
                id: user2.id
              }
            }
          );
        } else {
          const resetuser1 = await User.update(
            {
              ready: false,
              turn: null
            },
            {
              where: {
                id: user1.id
              }
            }
          );

          const resetuser2 = await User.update(
            {
              ready: false,
              turn: null
            },
            {
              where: {
                id: user2.id
              }
            }
          );
        }
      }
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = factory;
