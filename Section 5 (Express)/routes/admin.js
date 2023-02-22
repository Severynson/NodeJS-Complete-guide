import { Router } from "express";
import { join } from "path";
import rootDir from "../util/path.js";

const adminRouter = Router();

adminRouter.get("/add-product", (req, res, next) => {
  //   console.log("In the another middleware!");
  //   res.send(
  //     '<form action="/admin/add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  //   );
  res.sendFile(join(rootDir, "views", "add-product.html"));
});

adminRouter.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

export default adminRouter;
