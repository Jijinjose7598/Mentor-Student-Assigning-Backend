const mentorRouter = require("express").Router();
const mentor = require("./mentor.model");
const student=require("../student/student.model")
const { Types } = require("mongoose");

//api:http://localhost:3000/mentors

// create a mentor
mentorRouter.post("/create", async (req, res) => {
  const newMentor = new mentor(req.body);
  console.log(newMentor);
  try {
    const response = await mentor.create(newMentor);
    console.log(response);
    return res.status(201).json({
      message: "mentor created successfully",
    });
  } catch (error) {
    return res.json({
      message: "error creating mentor",
      error,
    });
  }
});

//get all mentor


mentorRouter.get("/", async (req, res) => {
  const response = await mentor.find();
  console.log(response);
  try {
    return res.json({
      message: "users feteched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong",
      error,
    });
  }
});

//get a user

mentorRouter.get("/mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  try {
    const response = await mentor.findOne({
      _id: new Types.ObjectId(mentorId),
    });

    if (response) {
      return res.status(200).json({
        message: "user feteched successfully",
        data: response,
      });
    } else {
      return res.status(404).json({
        message: "no user found",
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error,
    });
  }
});

// Get students of a particular mentor
mentorRouter.get("/:mentorId/students", async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentorData = await mentor
      .findOne({
        _id: new Types.ObjectId(mentorId),
      })
      .populate("studentsId"); // Assuming `studentsId` is a reference field

    if (!mentorData) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json({ data: mentorData.studentsId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});


//update a mentor

mentorRouter.patch("/update/mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  const { name, email, studentsId } = req.body;

  try {
    const updateObj = {};
    if (name) updateObj.name = name;
    if (email) updateObj.email = email;

    const mentorUpdate = { $set: updateObj };
    if (studentsId) {
      const studentIdsToAdd = Array.isArray(studentsId)
        ? studentsId
        : [studentsId];
      mentorUpdate.$addToSet = {
        studentsId: {
          $each: studentIdsToAdd.map((id) => new Types.ObjectId(id)),
        },
      };

      // Update the students' mentorId arrays
      await Promise.all(
        studentIdsToAdd.map(async (studentId) => {
          return student.findOneAndUpdate(
            { _id: new Types.ObjectId(studentId) },
            { $addToSet: { mentorId: new Types.ObjectId(mentorId) } },
            { new: true }
          );
        })
      );
    }

    const updatedMentor = await mentor.findOneAndUpdate(
      { _id: new Types.ObjectId(mentorId) },
      mentorUpdate,
      { new: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({
        message: "Failed updating mentor! No mentor found",
        data: [],
      });
    }

    return res.json({
      message: "Mentor updated successfully",
      data: updatedMentor,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});




// delete a mentor 

mentorRouter.delete("/delete/:mentorId", async (req, res) => {
  const { mentorId } = req.params;
  try {
    const response = await mentor.findOneAndDelete({
      _id: new Types.ObjectId(mentorId),
    });
    if (!response) {
      return res.status(404).json({
        message: "Failed deleting user! No user found",
      });
    } else {
      return res.status(200).json({
        message: "User deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

//student who has no mentor


module.exports = mentorRouter;