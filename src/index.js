const express = require("express");
const app = express();
const sse = require("json-sse");
const gameroom = require("./gameroom/model");
const User = require("./user/model");
const stream = new sse();
const port = process.env.PORT || 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
app.use(bodyParserMiddleWare);

const gameroomFactory = require("./gameroom/router");
const gameroomRouter = gameroomFactory(stream);

const userRouter = require("./user/router");
const authRouter = require("./auth/router");

app.use(userRouter);
app.use(authRouter);
app.use(gameroomRouter);

app.get("/", (req, res) => {
  stream.send("test");
  res.send("Welcome to our gameserver");
});

app.get("/stream", async (req, res, next) => {
  try {
    const gamerooms = await gameroom.findAll({ include: [User] });

    const action = {
      type: "ALL_GAMEROOMS",
      payload: gamerooms
    };

    const string = JSON.stringify(action);
    stream.updateInit(string);
    stream.init(req, res);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
