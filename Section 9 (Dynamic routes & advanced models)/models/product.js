const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const pathToProductsJSON = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(pathToProductsJSON, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    let productsForWriteFile;
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        productsForWriteFile = updatedProducts;
      } else {
        this.id = Math.random().toString();
        products.push(this);
        productsForWriteFile = products;
      }

      fs.writeFile(
        pathToProductsJSON,
        JSON.stringify(productsForWriteFile),
        (err) => {
          err &&
            console.log("ERROR WHILE WRITING PRODUCTS.JSON FILE ===>   ", err);
        }
      );
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      // Max's solution: const updatedProducts = products.filter(prod => prod.id !== id)

      const productToDeleteIndex = products.findIndex(
        (product) => product.id === id
      );
      const productToDeletPrice = products[productToDeleteIndex].price;

      Cart.deleteProduct(id, productToDeletPrice);

      const updatedProducts = [...products];
      updatedProducts.splice(productToDeleteIndex, 1);

      fs.writeFile(
        pathToProductsJSON,
        JSON.stringify(updatedProducts),
        (err) => {
          err &&
            console.log("ERROR WHILE WRITING PRODUCTS.JSON FILE ===>   ", err);
        }
      );
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((elements) => elements.id === id);
      cb(product);
    });
  }
};
