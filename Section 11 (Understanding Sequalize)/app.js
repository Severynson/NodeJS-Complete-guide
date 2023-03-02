const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequalize = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-items");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
  } catch (error) {
    console.error(error);
  }
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});

User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequalize
  //   .sync({ force: true }) // Will drop all tables. For development environment its OK;
  .sync()
  .then((result) => {
    // console.log(result);

    return User.findByPk(1);
  })
  .then((user) => {
    console.log("USERRRRRRRRRRR ======>>>>>    ", user);
    if (!user) {
      console.log("user was not created properly, but user is => ", user);
      return User.create({ name: "Severyn", email: "severynson@gmail.com" });
    } else return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.listen(8080);
  })
  .catch(
    (error) =>
      void console.log("ERROR WHILE SYNC WITH DB OR LISTENING SERVER", error)
  );
