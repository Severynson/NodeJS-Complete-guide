const http = require("http");
const fs = require("fs");
const DUMMY_USERS = [
  { name: "Chris", surname: "Johnson", text: "Hi, I'm Chris!" },
  { name: "Boris", surname: "Green", text: "Hi, I'm Boree!" },
];

const routes = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Assignment</title></head>");
    res.write(
      '<body><h1 style={{margin: "200px", color: "green"}}>Hi there!</h1></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user") {
    res.write('<html>');
    res.write('<head><title>Enter new user</title></head>');
    res.write(
      '<body><form action="/adding-user" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  };

  if (url === "/adding-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      const userData = message.split("+");
      const user = {};
      user.name = userData[0];
      user.surname = userData[1];
      user.text = userData[2];
      DUMMY_USERS.push(user);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>Assignment</title></head>");
    res.write('<body>');
    res.write('<ul>');
    res.write(`${DUMMY_USERS.map((user) => {
        return `<li>${user.name} ${user.surname}: "${user.text}"</li>`
    }).join('')}`);
    res.write('</ul>');
    res.write('</body>');
    res.write("</html>");
    return res.end();
  }

};

const server = http.createServer(routes);
server.listen(3000);
