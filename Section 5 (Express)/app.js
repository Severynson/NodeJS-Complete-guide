import express from "express";
import bodyParser from "body-parser";
import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import { join } from "path";
import rootDir from "./util/path.js";
// import http from "http";

const app = express();

// app.use((req, res, next) => {
//   if (req.url === "/") console.log("In the middleware here!");
//   else next();
// });

// app.use((req, res, next) => {
//   if (req.url === "/r")
//     console.log("I have just understood express middleware's next function");
// });

// app.use("/", (req, res, next) => {
//   console.log("In the middleware!");
//   next(); // Allow middleware to continue it's jorney;
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(rootDir, "public")));

// app.use("/", (req, res, next) => {
//   console.log("This always runs!");
//   next();
// });

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use((req, res) => {
  //   res.status(404).send("<h1>Page not found</h1>");
  res.sendFile(join(rootDir, "views", "404.html"));
});

app.listen(8080);

// // Exercise 1:

// import express from "express";
// const app = express();

// app.use((req, res, next) => {
//   console.log(
//     "This middleware works each time and just making a log to the console..."
//   );
//   next();
// });

// app.use((req, res, next) => {
//   console.log("This middleware is sending a respose back to client as well:");
//   res.send(
//     '<h1>Some HTML-type response is here, header-type "HTML" will be provided automaticly for sending a string data type in your response ;)</h1>'
//   );
// });

// app.listen(8080);

// // Exercise 2:

// import express from "express";
// const app = express();

// app.use("/users", (req, res, next) => {
//   res.send('<h1>Dummy response for "/users" path</h1>');
// });

// app.use((req, res, next) => {
//   res.send('<h1>Dummy response for "/" path</h1>');
// });

// app.listen(8080);
