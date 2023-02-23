const express = require("express");
const bodyParser = require("body-parser");

const { Router } = express;

const app = express();
const router = Router();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const users = [];

router.get("/users", (req, res) => {
  res.render("users", { users });
});

router.get("/", (req, res) => {
  res.render("add-user");
});

router.post("/", (req, res) => {
  console.log(req.body.name);
  const { name } = req.body;
  users.push(name);
  res.redirect("/users");
});

app.use(router);
app.listen(8080);
