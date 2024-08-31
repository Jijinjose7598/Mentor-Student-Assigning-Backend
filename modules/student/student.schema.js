const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
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
    mentorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentor",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = studentSchema;
