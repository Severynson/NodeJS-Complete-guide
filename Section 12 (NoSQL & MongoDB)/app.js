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

// Deleting deleted from a shop products from all carts of all users:
scheduleJob("*/45 * * * * *" /* every 45 seconds */, async () => {
  const db = getDB();
  const users = await db.collection("users").find().toArray();
  const products = await db.collection("products").find().toArray();

  users.forEach((user) => {
    const currentUser = new User(user.name, user.email, user.cart, user._id);

    if (!currentUser.cart.items.length) return;
    else {
      currentUser.cart.items.forEach((cartItem) => {
        const productId = cartItem.productId.toString();
        const productDoesntExistAnymore = !products.find(
          (iteratedProduct) => iteratedProduct._id.toString() === productId
        );

        if (productDoesntExistAnymore)
          currentUser.deleteItemFromCart(productId);
      });
    }
  });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect().then(app.listen(8080));
