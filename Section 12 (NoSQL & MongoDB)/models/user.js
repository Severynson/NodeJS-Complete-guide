const { ObjectId } = require("mongodb");
const { getDB } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: [...]};
    this._id = id ? new ObjectId(id) : null;
  }

  static async save() {
    let result;
    try {
      const db = getDB();
      const usersCollection = db.collection("users");
      if (this._id) {
        // Update existing user;
        result = await usersCollection.updateOne(
          { _id: this._id },
          { $set: this }
        );
      } else {
        // Create a new one user;
        result = await usersCollection.insertOne(this);
      }

      console.log("RESULT OF CREATING OR UPDATING A USER", result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cartProduct) =>
        cartProduct.productId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0)
      (newQuantity = this.cart.items[cartProductIndex].quantity + 1),
        (updatedCartItems[cartProductIndex].quantity = newQuantity);
    else
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });

    try {
      const updatedCart = { items: updatedCartItems };
      const db = getDB();
      const usersCollection = db.collection("users");
      const result = usersCollection.updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getCart() {
    const db = getDB();
    const productsCollection = db.collection("products");

    const productIds = this.cart.items.map((i) => i.productId);
    const products = await productsCollection
      .find({ _id: { $in: productIds } })
      .toArray();
    const productsWithQuantity = products.map((product) => ({
      ...product,
      quantity: this.cart.items.find(
        (item) => item.productId.toString() === product._id.toString()
      ).quantity,
    }));

    return productsWithQuantity;
  }

  async deleteItemFromCart(productId) {
    console.log(this.cart.items[0].productId, productId)
    try {
      const updatedCartItems = this.cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      const db = getDB();
      const usersCollection = db.collection("users");
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
      return result;
    } catch (error) {
      console.error(
        "ERROR WHILE DELETING THE PRODUCT FROM A CART ===>  ",
        error
      );
    }
  }

  async addOrder() {
    const db = getDB();
    const products = await this.getCart();

    const order = {
      items: products,
      user: { _id: new ObjectId(this._id), name: this.username },
    };
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    await ordersCollection.insertOne(order);
    this.cart = { items: [] };

    const result = usersCollection.updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: { items: [] } } }
    );

    return result;
  }

  async getOrders() {
    const db = getDB();
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection
      .find({
        "user._id": new ObjectId(this._id),
      })
      .toArray();

    return orders;
  }

  static async findById(userId) {
    try {
      const db = getDB();
      const usersCollection = db.collection("users");
      const user = await usersCollection
        .find({ _id: new ObjectId(userId) })
        .next();
      console.log("FOUND BY ID USER ===>  ", user);
      return user;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = User;
