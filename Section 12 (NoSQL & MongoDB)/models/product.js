const { ObjectId } = require("mongodb");
const { getDB } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  async save() {
    try {
      const db = getDB();
      const productsCollection = db.collection("products");
      if (this._id) {
        // Update existing product;
        productsCollection.updateOne({ _id: this._id }, { $set: this });
      } else {
        // Create a new one product;
        const result = await productsCollection.insertOne(this);
        return result;
      }

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  static async fetchAll() {
    try {
      const db = getDB();
      const productsCollection = db.collection("products");
      const products = await productsCollection.find().toArray();
      console.log(products);
      return products;
    } catch (error) {
      console.error(error);
    }
  }

  static async findById(id) {
    try {
      const db = getDB();
      const productsCollection = db.collection("products");
      const product = await productsCollection
        .find({ _id: new ObjectId(id) })
        .next();
      console.log("FOUND BY ID PRODUCT ===>  ", product);
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteById(id) {
    try {
      const db = getDB();
      const productsCollection = db.collection("products");
      const resultOfDeleting = await productsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      console.log("RESULT OF THE PRODUCT DELETING ===>  ", resultOfDeleting);
    } catch (error) {
      console.error(error);
    }
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

module.exports = Product;
