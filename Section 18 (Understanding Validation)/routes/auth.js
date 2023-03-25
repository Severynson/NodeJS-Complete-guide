const express = require("express");
const { check, body } = require("express-validator/check");
const { hash, compare } = require("bcryptjs");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isLength({ min: 5 })
      .withMessage("Email can not be so short!!!")
      .isEmail()
      .withMessage("Please, enter a valid email format (****@***.***!")
      .custom(async (email, { req }) => {
        const userDoc = await User.findOne({ email });

        if (!userDoc)
          return Promise.reject(
            "User with such email do not exist, please signup at first."
          );
      }),

    body("password")
      .isAlphanumeric()
      .withMessage("Password has to be alphanumeric, invalid format!")
      .isLength({ min: 5 })
      .withMessage("Password can not be so short, 5 characters at least!")
      .custom(async (password, { req }) => {
        const userDoc = await User.findOne({ email: req.body.email });

        if (!(await compare(password, userDoc.password)))
          return Promise.reject(
            "Invalid password! Reset if you forgot it using your email."
          );
      }),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please, enter a valid email!")
      .normalizeEmail()
      .custom(async (value, { req }) => {
        // const allUsers = await User.find();
        // console.log(allUsers, value);
        // if (allUsers.map((user) => user.email).includes(value))
        //   throw new Error("This email adress is used already by another user.");
        // else return true;

        const userDoc = await User.findOne({ email: value });
        if (userDoc)
          return Promise.reject(
            "This email exist already, please pick a different one."
          );
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Passwords has to match!");
        else return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
