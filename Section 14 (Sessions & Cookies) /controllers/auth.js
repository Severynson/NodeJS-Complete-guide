const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isLoggedIn = !!req.session.user;

  // req.get("Cookie")?.split("=")[1] === "true";

  console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn ? isLoggedIn : false,
  });
};

exports.postLogin = async (req, res, next) => {
  // req.isLoggedIn = true; // Doesn't work of course because of not being middleware.
  // And even if it wold be - it would share the private information across the different users;
  // So we has to use private browser variables - cookies.

  // res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10;  HttpOnly"); // Secure;

  // Or the better aproach will be session:

  // req.session.isLoggedIn = true;

  try {
    const user = await User.findById("6405cf3ea819072d53f4c34f");
    req.session.user = user;
    req.session.save((error) => {
      error && console.error(error);
      res.redirect("/");
      if (error) throw error;
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect("/");
    error & console.error(error);
  });
};
