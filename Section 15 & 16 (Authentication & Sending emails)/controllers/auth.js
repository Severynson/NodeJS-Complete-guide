const { hash, compare } = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_user: "",
      api_key: "",
    },
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    csrfToken: req.csrfToken(),
    errorMessage: req.flash("error"),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    } else {
      const doMatch = await compare(password, user.password);

      (err) => {
        console.log(err);
        res.redirect("/");
      };

      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((error) => {
          error && console.error(error);
          if (error) throw error;
          res.redirect("/");
        });
      } else {
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postSignup = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) return res.redirect("/signup");
  else {
    const result = await new User({
      username,
      email,
      password: await hash(password, 5),
      cart: { items: [] },
    }).save();

    result && res.redirect("/login");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
