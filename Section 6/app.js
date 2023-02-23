const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const app = express();

// app.engine(
//   "hbs",
//   expressHbs({
//     layoutsDir: "views/layouts/", // default value,
//     // unnecessary to reconfigure if folder's name is "layout" and its located in the 'views' folder;
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );

// app.set("view engine", "hbs");
app.set("view engine", "ejs");
// app.set("view engine", "pug");
// app.set("views", "views"); // "views" is default value,
// unnecessary to set manualy if folder's name is the most common name "view";

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res
    .status(404)
    .render("404", {
      pageTitle: "404 - Page not found",
      path: "some uncorrect path",
    });
});

app.listen(8080);
