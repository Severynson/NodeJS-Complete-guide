const fs = require("fs");
const path = require("path");

const pathToCartJSON = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart;
    fs.readFile(pathToCartJSON, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analize the cart => Find existing product;
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      // Add new product / Increase the quantity;
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(pathToCartJSON, JSON.stringify(cart), (err) => {
        err && console.log("ERROR WHILE WRITING CART.JSON FILE ===>   ", err);
      });
    });
  }

  static deleteProduct(id, productToDeletePrice) {
    fs.readFile(pathToCartJSON, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const updatedCart = cart.products.filter((product) => product.id !== id);

      const productToDelete = cart.products.find(
        (product) => product.id === id
      );

      if (!productToDelete) return;

      cart.totalPrice =
        cart.totalPrice - +productToDeletePrice * productToDelete.qty;
      cart.products = [...updatedCart];
      fs.writeFile(pathToCartJSON, JSON.stringify(cart), (err) => {
        err && console.log("ERROR WHILE WRITING CART.JSON FILE ===>   ", err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(pathToCartJSON, (error, fileContent) => {
      if (error) {
        console.log("ERROR WHILE READING CART.JSON FILE ===>   ", error);
        callback(null);
      }
      const cart = JSON.parse(fileContent);
      callback(cart);
    });
  }
};
