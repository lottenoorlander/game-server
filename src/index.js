const express = require("express");
const app = express();
const port = 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const bodyParserMiddleWare = bodyParser.json();
app.use(bodyParserMiddleWare);

const userRouter = require("./user/router");
const authRouter = require("./auth/router");

app.use(userRouter);
app.use(authRouter);

app.get("/", (req, res) => res.send("Welcome to our gameserver"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
