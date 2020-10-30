const http = require("http");
const port = process.env.PORT || 3000;
const app = require("./app");

const server = http.createServer(app);
server.listen(port);

if (!server) {
  console.log("*LOG: Server fails");
} else {
  console.log("*LOG: Server is running on port " + port);
}
