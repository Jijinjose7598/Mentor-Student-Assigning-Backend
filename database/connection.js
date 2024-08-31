const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017";

async function initialize_mongo_connectivity() {
  console.log("mongodb connectivity initialize");
  try {
    const response = await mongoose.connect(URI, {
      dbName: "guvi",
    });

    console.log("mongodb connectivity success");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  initialize_mongo_connectivity,
};
