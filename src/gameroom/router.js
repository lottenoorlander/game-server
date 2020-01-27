const { Router } = require("express");
const Gameroom = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

// function executeTurnSendBoardResetValues(firstUser, secondUser){

//   const dealStartPhase = await Gameroom.update(
//     { phase: "executeTurn" },
//     {
//       where: {
//         id: user1.gameroomId
//       }
//     })

//   movement(firstUser, secondUser); //     if > true => movement(user1, user1.turn) .then movement(user2, user2.turn)
//   movement(secondUser, firstUser); //DOES THIS WORK THE WAY I THINK??
//           //normally check win
//   const everything = await Gameroom.findAll({ include: [User] });

//   const action = {
//     type: "ALL_GAMEROOMS",
//     payload: everything
//   };

//   const string = JSON.stringify(action);

//   stream.send(string); // .then send all gamerooms

//   const resetuser1 = await User.update(
//     {
//       ready: false, //how we want to update
//       move: null
//     },
//     {
//       where: {
//         id: firstUser.id //which user to update
//       }
//     });  // .then set ready to false and turn to null .then set phase of gameroom to execute turn or deal card? //DOES EXECUTE TURN MAKE SENSE? MAYBE INSTEAD DO DEAL CARD AND FRONTEND DEALS WITH DISPLAY MOVES BEFORE DEAL CARD!

//   const resetuser2 = await User.update(
//     {
//       ready: false, //how we want to update
//       move: null
//     },
//     {
//       where: {
//         id: secondUser.id //which user to update
//       }
//     })

//   const dealStartPhase = await Gameroom.update(
//     { phase: "startTurn" },
//     {
//       where: {
//         id: user1.gameroomId
//       }
//     })
// }

// function movement(user, user2){
//   const move = user.turn[1]
//   if(move === "up"){
//     const updatePositionUp = await User.update(
//       {
//         position: user.position[1] - 1
//       },
//       {
//         where: {
//           id: user.id //which user to update
//         }
//       });
//   } else if(move === "down"){
//     const updatePositionDown = await User.update(
//       {
//         position: user.position[1] + 1
//       },
//       {
//         where: {
//           id: user.id //which user to update
//         }
//       });
//   } else if(move === "left"){
//     const updatePositionLeft = await User.update(
//       {
//         position: user.position[0] - 1
//       },
//       {
//         where: {
//           id: user.id //which user to update
//         }
//       });
//   } else (move === "right"){
//     const updatePositionRight = await User.update(
//       {
//         position: user.position[0] + 1
//       },
//       {
//         where: {
//           id: user.id //which user to update
//         }
//       });
//   }

//   // is player still on board or did they hit another player?
//   if(user.position[0] >= 16 || user.position[1] >= 12){
//     const updatePositionStart = await User.update(
//       {
//         position: user.startposition
//       },
//       {
//         where: {
//           id: user.id //which user to update
//         }
//       })
//   } else if(user.position === user2.position){
//     const updateHealth = await User.update(
//       {
//         health: user2.health - 1,
//         position: user.startposition
//       },
//       {
//         where: {
//           id: user2.id //which user to update
//         }
//       })
//   }

// }

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
            id: req.user.id //which user to update
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

  router.put("/start", auth, async (req, res, next) => {
    try {
      const { user } = req;

      const userReady = await User.update(
        {
          ready: true //how we want to update
        },
        {
          where: {
            id: user.id //which user to update
          }
        }
      );

      const gameroom = await Gameroom.findByPk(user.gameroomId, {
        include: [User]
      });

      const { users } = gameroom;

      const ready = users.every(user => user.ready);
      if (ready) {
        const gameroomPhaseStart = await Gameroom.update(
          {
            phase: "startTurn" //how we want to update
          },
          {
            where: {
              id: user.gameroomId //which user to update
            }
          }
        );

        const player2startpos = await User.update(
          {
            startposition: [1, 3], //how we want to update
            ready: false
          },
          {
            where: {
              id: user.id //which user to update
            }
          }
        );
        ///SOMEHOW UPDATE OTHER USER.ready to FALSE again DOES NOT WORK
        const resetReady = await User.update(
          {
            ready: false //how we want to update
          },
          {
            where: {
              id: users[1].id //which user to update
            }
          }
        );
      } else {
        console.log("this should run");
        const player1startpos = await User.update(
          {
            startposition: [1, 1] //how we want to update
          },
          {
            where: {
              id: user.id //which user to update
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

  // router.put("/turn", auth, async (req, res, next) => {
  //   try {
  //     const requser = await User.update(
  //       //update req send to ready and save move
  //       {
  //         ready: true, //how we want to update
  //         move: req.body.turn
  //       },
  //       {
  //         where: {
  //           id: req.user.id //which user to update
  //         }
  //       }
  //     );

  //     const { user } = req;

  //     const gameroom = await Gameroom.findByPk(user.gameroomId, {
  //       include: [User]
  //     });

  //     const { users } = gameroom;

  //     const ready = users.every(user => user.ready);
  //     const user1 = gameroom.user[0];
  //     const user2 = gameroom.user[1];

  //     if (ready) {
  //       const order = user1.turn[0] > user2.turn[0]; // check user1.turn[priority] > user2.turn[priority]
  //       if (order) {
  //         executeTurnSendBoardResetValues(user1);
  //       } else {
  //         executeTurnSendBoardResetValues(user2);
  //       }
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  return router;
}

module.exports = factory;
