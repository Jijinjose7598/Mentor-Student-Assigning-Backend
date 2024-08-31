const studentRouter = require("express").Router();
const student = require("./student.model");
const mentor = require("../mentor/mentor.model")
const { Types } = require("mongoose");

//api:http://localhost:3000/students

// create a mentor
studentRouter.post("/create", async (req, res) => {
  const newStudent = new student(req.body);
  console.log(newStudent);
  try {
    const response = await student.create(newStudent);
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

studentRouter.get("/", async (req, res) => {
  const response = await student.find();
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

//get a student

studentRouter.get("/student/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const response = await student.findOne({
      _id: new Types.ObjectId(studentId),
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

// update a student

studentRouter.patch("/update/student/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const updateData = req.body;

  try {
    const updateObj = {};
    const addToSetObj = {};

    for (const key in updateData) {
      if (Array.isArray(updateData[key])) {
        addToSetObj[key] = { $each: updateData[key] };
      } else {
        updateObj[key] = updateData[key];
      }
    }

    const updatedStudent = await student.findOneAndUpdate(
      { _id: new Types.ObjectId(studentId) },
      {
        $set: updateObj,
        ...(Object.keys(addToSetObj).length && { $addToSet: addToSetObj }),
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Failed updating student! No student found",
        data: [],
      });
    }

    // If studentsId or mentorId was updated, update corresponding mentor
    if (updateData.mentorId) {
      const mentorIdsToAdd = Array.isArray(updateData.mentorId)
        ? updateData.mentorId
        : [updateData.mentorId];
      await Promise.all(
        mentorIdsToAdd.map(async (mentorId) => {
          return mentor.findOneAndUpdate(
            { _id: new Types.ObjectId(mentorId) },
            { $addToSet: { studentsId: new Types.ObjectId(studentId) } },
            { new: true }
          );
        })
      );
    }

    return res.json({
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});


// studentRouter.patch("/update/student/:studentId", async (req, res) => {
//   const { studentId } = req.params;
//   console.log("Received studentId:", studentId);
//   console.log("Request body:", req.body);

//   try {
//     const response = await student.findOneAndUpdate(
//       { _id: new Types.ObjectId(studentId) },
//       { $set: req.body },
//       { new: true }
//     );
//     console.log("Update response:", response);

//     if (!response) {
//       return res.status(404).json({
//         message: "Failed updating user! No user found",
//         data: [],
//       });
//     } else {
//       return res.json({
//         message: "User updated successfully",
//         data: response,
//       });
//     }
//   } catch (error) {
//     console.error("Update error:", error);
//     return res.status(500).json({
//       message: "Something went wrong",
//       error,
//     });
//   }
// });

// delete a student

studentRouter.delete("/delete/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const response = await student.findOneAndDelete({
      _id: new Types.ObjectId(studentId),
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

studentRouter.get("/:studentId/previous-mentors", async (req, res) => {
  const { studentId } = req.params;
  try {
    // Find the student and populate the mentorId field
    const response = await student
      .findOne({ _id: new Types.ObjectId(studentId) })
      .populate("mentorId");

    if (!response || response.mentorId.length === 0) {
      return res.status(404).json({
        message: "No mentors found",
        data: [],
      });
    } else {
      // Get all mentors except the last one
      const previousMentors = response.mentorId.slice(0, -1);

      return res.json({
        message: "Previous mentors fetched successfully",
        data: previousMentors,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});




// Pop the last mentor from the student's mentorId array
studentRouter.patch("/student/:studentId/pop-last-mentor", async (req, res) => {
  const { studentId } = req.params;
  try {
    // Pop the last mentorId from the array
    const response = await student.findOneAndUpdate(
      { _id: new Types.ObjectId(studentId) },
      { $pop: { mentorId: 1 } },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        message: "No student found or no mentor to pop",
        data: [],
      });
    } else {
      return res.json({
        message: "Last mentor popped successfully",
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





studentRouter.get("/all-students/without-mentors", async (req, res) => {
  try {
    const studentsWithoutMentors = await student.find({
      mentorId: { $size: 0 },
    });
    res.json({ data: studentsWithoutMentors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = studentRouter;
