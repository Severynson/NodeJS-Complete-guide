const { Schema, model, Types } = require("mongoose");

const OrderSchema = new Schema({
  products: [
    {
      productData: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    username: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
  },
});

module.exports = model("Order", OrderSchema);
