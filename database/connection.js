const mongoose = require("mongoose");

const URI ="mongodb+srv://Jijin:jijin2000@guvitask.afrhp.mongodb.net/?retryWrites=true&w=majority&appName=GUVITASK"; // Including the database name in the URI

async function initialize_mongo_connectivity() {
  console.log("Initializing MongoDB connectivity");
  try {
    await mongoose.connect(URI);

    console.log("MongoDB connectivity successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = {
  initialize_mongo_connectivity,
};
