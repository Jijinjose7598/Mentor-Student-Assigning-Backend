const mongoose = require("mongoose");

const mentorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    batchName: {
      type: String,
      required: false,
    },
    studentsId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "student",
    },
  },
  { timestamps: true }
);

module.exports = mentorSchema;
