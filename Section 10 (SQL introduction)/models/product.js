const db = require("../util/database");

const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const { title, price, imageUrl, description } = this;
    return db.execute(
      "INSERT INTO `node-complete`.products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [title, price, imageUrl, description]
    );
  }

  static deleteById(id) {
    return db.execute(
      "DELETE * FROM `node-complete`.products WHERE `node-complete`.products.id = ?",
      [id]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM `node-complete`.products;");
  }

  static findById(id) {
    return db.execute(
      "SELECT * FROM `node-complete`.products WHERE `node-complete`.products.id = ?",
      [id]
    );
  }
};
