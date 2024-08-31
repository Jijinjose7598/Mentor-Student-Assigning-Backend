const mongoose = require("mongoose");
const mentorSchema = require("./mentor.schema");


const mentorModel = mongoose.model("mentor", mentorSchema);

module.exports = mentorModel;
