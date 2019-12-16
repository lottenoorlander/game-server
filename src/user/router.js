const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");
const router = new Router();

router.post("/user", (req, res, next) => {
  const user = {
    userName: req.body.userName,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  console.log(user);

  User.create(user)
    .then(user => res.send(user))
    .catch(error => next(error));
});

module.exports = router;
