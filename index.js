const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const { initialize_mongo_connectivity } = require("./database/connection");

const server = express();

server.use(
  cors({
    origin: "*", // Allow this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

server.use(bodyparser.json());
server.use("/mentors", require("./modules/mentor/mentor.controller"));
server.use("/students", require("./modules/student/student.controller"));

// Error handling middleware
server.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Something went wrong!");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server started on http://localhost:3000");
  initialize_mongo_connectivity();
});
