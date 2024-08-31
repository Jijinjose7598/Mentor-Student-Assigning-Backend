const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const { initialize_mongo_connectivity } = require("./database/connection");

const server = express();

server.use(cors());
server.use(bodyparser.json());
server.use("/mentors", require("./modules/mentor/mentor.controller"));
server.use("/students", require("./modules/student/student.controller"));

server.listen(3000, "localhost", () => {
  console.log("Server started on http://localhost:3000");
  initialize_mongo_connectivity();
});
