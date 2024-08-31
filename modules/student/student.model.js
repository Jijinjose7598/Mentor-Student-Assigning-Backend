const mongoose = require("mongoose");
const studentSchema = require("./student.schema");

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
