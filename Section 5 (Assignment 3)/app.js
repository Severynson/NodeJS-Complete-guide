import express, { Router } from "express";
import { join } from "path";
import rootDir from "./util/path.js";

const app = express();
const router = Router();

app.use(express.static(join(rootDir, "public")));

router.get("/", (req, res, next) => {
  res.sendFile(join(rootDir, "views", "index.html"));
});

router.get("/users", (req, res, next) => {
  res.sendFile(join(rootDir, "views", "users.html"));
});

app.use(router);

app.listen(8080);
