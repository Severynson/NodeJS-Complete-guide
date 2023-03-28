const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = {
  // hello() {
  //   return {
  //     text: "Hello world!",
  //     views: 343,
  //   };
  // },

  async createUser(props, req) {
    const {
      userInput: { email, name, password },
    } = props;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, name, password: hashedPassword });
      const createdUser = await user.save();

      return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
  },
};
