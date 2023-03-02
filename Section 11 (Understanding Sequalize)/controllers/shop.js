const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        pat,
      });
    })
    .catch((err) => void console.error(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = async (req, res, next) => {
  const products =
    await Product.findAll(/* {where: {someProperty : 'someValue'}} */);

  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch (error) {
    console.error(error);
  }

  // Cart.getCart(async (cart) => {
  //   // Product.fetchAll((products) => {
  //   const products = await Product.findAll();
  //   const cartProducts = [];
  //   for (product of products) {
  //     const cartProductData = cart.products.find(
  //       (prod) => prod.id === product.id
  //     );
  //     if (cartProductData) {
  //       cartProducts.push({ productData: product, qty: cartProductData.qty });
  //     }
  //   }
  //   res.render("shop/cart", {
  //     path: "/cart",
  //     pageTitle: "Your Cart",
  //     products: cartProducts,
  //   });
  //   // });
  // });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    let product;
    let newQuantity = 1;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });

    if (products.length > 0) product = products[0];

    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else product = await Product.findByPk(prodId);

    await cart.addProduct(product, { through: { quantity: newQuantity } });
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const cart = await req.user.getCart();
    const [product] = await cart.getProducts({ where: { id: prodId } });
    await product.cartItem.destroy();
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
  }

  // Product.findByPk(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );

    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: ["products"] });

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders,
  });
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
