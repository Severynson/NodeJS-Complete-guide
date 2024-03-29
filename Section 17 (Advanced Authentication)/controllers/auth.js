const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one."
        );
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "shop@node-complete.com",
            subject: "Signup succeeded!",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    try {
      if (error) {
        req.flash(
          "error",
          "Error has been occured while trying to reset password, try again later!"
        );
        return res.redirect("/reset");
      } else {
        const { email, password } = req.body;
        const token = buffer.toString("hex");
        const user = await User.findOne({ email });
        if (!user) {
          req.flash("error", "No email with that email has been found");
          return req.redirect("/reset");
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          (await user.save()) &&
            transporter.sendMail({
              to: req.body.email,
              from: "shop@node-complete.com",
              subject: "Password reset!",
              html: `
            <p>You requested a password reset,</p>
            <p>click this <a href="http://localhost:8080/reset/${token}"></a> link to set a new password.</p>
            `,
            });
        }
      }
    } catch (error) {
      console.error(
        "Error has been occured while trying to reset password, try again later! ",
        error
      );
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const resetToken = req.params.token;
  const user = await User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: resetToken,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { userId, password: newPassword, passwordToken } = req.body;
  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = null;
    resetTokenExpiration = null;

    (await user.save()) && res.redirect("/login");
  } catch (error) {
    if (error) throw error;
    console.error(error);
  }
};
