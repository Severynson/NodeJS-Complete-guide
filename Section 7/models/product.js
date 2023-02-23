// const products = [];
const fs = require("fs").promises;
const path = require("path");

const pathToProductsJSON = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    let products = [];

    fs.readFile(pathToProductsJSON)
      .then((fileContent) => {
        products = JSON.parse(fileContent);
        products.push(this);
        fs.writeFile(pathToProductsJSON, JSON.stringify(products));
      })
      .catch((err) => {
        console.log(err);
        fs.writeFile(pathToProductsJSON, JSON.stringify(products));
      });

    // !!! DOWNCOMING CODE IS DEPRECATED VERSION FROM COURS AND ITS DOESN'T WORK !!!

    // console.log("require.main.filename ====>>>   ", require.main.filename);
    // console.log("pathToProductsJSON ====>>>   ", pathToProductsJSON);
    // // JSON.stringify(Buffer(pathToProductsJSON).toJSON().data)
    // fs.readFile(pathToProductsJSON, (err, fileContent) => {
    //   let products = [];
    //   if (!err) {
    //     console.log("fileContent ===>>>   ", fileContent);
    //     products = Buffer(fileContent).toJSON().data;
    //     // products = JSON.parse(fileContent);
    //   }
    //   console.log(products);
    //   products.push(this);
    //   fs.writeFile(pathToProductsJSON, JSON.stringify(products), (err) => {
    //     console.log(err);
    //   });
    // });
  }

  static async fetchAll() {
    try {
      return JSON.parse(await fs.readFile(pathToProductsJSON));
    } catch (err) {
      console.error(err);
      return [];
    }
  }
};
