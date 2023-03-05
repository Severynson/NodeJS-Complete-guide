const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { scheduleJob } = require("node-schedule");

const errorController = require("./controllers/error");
const { mongoConnect, getDB } = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64045f6e0ed75381435afd5e")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

scheduleJob("*/5****", async () => {
  // With creating real different users mapping trough them is needed;
  const db = getDB();
  const users = await db.collection("users").find().toArray();
  const products = await db.collection("products").find().toArray();

  users.forEach((user) => {
    const currentUser = new User(user.name, user.email, user.cart, user._id);
    if (!currentUser.cart.items.length) return;
    else {
      currentUser.cart.forEach((cartItem) => {
        if (!products.includes(cartItem))
          currentUser.deleteCartItem(cartItem._id);
      });
    }
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect().then(app.listen(8080));
