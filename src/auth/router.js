const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const router = new Router();
const bcrypt = require("bcrypt");
const User = require("../user/model");
const auth = require("./middleware");

router.post(
  "/login",
  (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) {
      res.status(400).send({
        message: "Please supply a valid username and password"
      });
    } else {
      // 1. find user based on username
      User.findOne({
        where: {
          userName: req.body.userName
        }
      })
        .then(entity => {
          if (!entity) {
            res.status(400).send({
              message: "User with that username does not exist"
            });
          }
          // 2. use bcrypt.compareSync to check the password against the stored hash
          else if (bcrypt.compareSync(req.body.password, entity.password)) {
            // 3. if the password is correct, return a JWT with the userId of the user (user.id)
            res.send({
              jwt: toJWT({ userId: entity.id }),
              userName: req.body.userName
            });
          } else {
            res.status(400).send({
              message: "Password was incorrect"
            });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            message: "Something went wrong"
          });
        });
    }
  }
  // .catch(error => next(error))
);

// router.get("/secret-endpoint", auth, (req, res) => {
//   res.send({
//     message: `Thanks for visiting the secret endpoint ${req.user.userName}.`
//   });
// });

module.exports = router;
