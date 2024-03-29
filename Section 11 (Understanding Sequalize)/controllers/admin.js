const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const userId = req.user.id;
  // const product = new Product(null, title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch(err => console.log(err));
  try {
    // const result =
    await req.user.createProduct({
      title,
      price,
      imageUrl,
      description,
      // userId,
    });
    // await Product.create({
    //   title,
    //   price,
    //   imageUrl,
    //   description,
    //   // userId,
    // });
    // console.log(result);
    // result &&
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    const product = await Product.findByPk(prodId);

    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = await Product.findByPk(prodId);

  product.title = updatedTitle;
  product.price = updatedPrice;
  product.description = updatedDesc;
  product.imageUrl = updatedImageUrl;

  product.save();

  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  // Product.fetchAll((products) => {
  const products = await Product.findAll();

  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
  // });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;

    const product = await Product.findByPk(prodId);
    product.destroy();

    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
  }
};
