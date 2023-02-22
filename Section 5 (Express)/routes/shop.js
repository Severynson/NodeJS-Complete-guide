import { Router } from "express";
import { join } from "path";
import rootDir from "../util/path.js";

const shopRouter = Router();

shopRouter.get("/", (req, res, next) => {
  //   res.send('<a href="/admin/add-product">Add a Product</a>');
  res.sendFile(join(rootDir, "views", "shop.html"));
});

export default shopRouter;
