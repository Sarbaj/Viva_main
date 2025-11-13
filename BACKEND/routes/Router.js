//middleware will be applied soon

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import {
  User,
  classModel,
  syllabusModel,
  vivaModel,
  classStudent,
  resultModel,
} from "../model/AllModel.js";
import axios from "axios";
import mongoose from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET;
router.get("/data", (req, res) => {
  res.send("Getting Response");
});

router.post("/getUsername", async (req, res) => {
  const token = req.body.token;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload:", payload);
    const existingUser = await User.findOne({ ennumber: payload.ennumber });
    const Info = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      ennumber: existingUser.ennumber,
      role: existingUser.role,
    };
    return res.status(200).send({ message: "User found", payload: Info });
  } catch {
    console.log("Token expired");
  }
});

// Register Route For StudentRegister

router.post("/registerstudent", async (req, res) => {
  const { name, email, password, ennumber } = req.body;
  if (!name || !email || !password || !ennumber)
    return res.status(400).json({ message: "All field are required" });

  try {
    const existingUser = await User.findOne({ ennumber });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Student Already registered With Enrollment Number" });
    }
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(409).json({ message: "Email Already Exist " });
    }
    //lets Genrate Hash Bro
    //First Salt
    const salt = await bcrypt.genSalt(10);
    const Hashedpassword = await bcrypt.hash(password, salt);

    const regisuser = new User({
      name,
      email,
      password: Hashedpassword,
      ennumber,
      role: "0",
    });
    await regisuser.save();
    res
      .status(201)
      .json({ message: "Student Registered Successfully", status: 201 });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// get teacher

//login route

router.post("/login", async (req, res) => {
  const { ennumber, password } = req.body;
  if (!ennumber || !password)
    return res
      .status(400)
      .json({ message: "Enrollment-Number and password required" });
  try {
    const user = await User.findOne({ ennumber });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Enrollment-Number Is Incorrect" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password Is Incorrect" });
    }

    //if match then
    // Generate JWT token

    const token = jwt.sign(
      { ennumber: user.ennumber, Usernname: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    if (user.role == "0") {
      return res.json({
        token,
        messege: `Login success as student and en-number is ${user.ennumber}`,
      });
    } else if (user.role == "2") {
      return res.json({
        token,
        messege: `Login success as Admin Successfully `,
      });
    } else if (user.role == "1") {
      return res.json({
        token,
        messege: `Login success as Teacher ${user.email}`,
      });
    }
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// quetion route

router.post("/api/questions", async (req, res) => {
  const { syllabus, totalq } = req.body;
  const NoData = "```javascript ``` dont add any thing after ]";
const prompt = `Generate ${totalq} multiple-choice questions for a viva exam based on the following syllabus: "${syllabus}". Each question should include:
- A "question" string
- An "options" object with keys "A", "B", "C", and "D"
- An "answer" string containing the correct option key ("A", "B", "C", or "D")

JSON array format only. Do not include markdown or any text outside the JSON. use double quotes ("") for all keys and values. Do not add any text before or after the array. Only give the array.
`;


  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.AIKEY}
`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const output = response.data.candidates[0].content.parts[0].text;

  let parsedOutput;
 try {
  // Clean up markdown-style wrappers
  const cleanOutput = output
    .replace(/```json|```/g, '') // remove ```json and ```
    .trim();

  // Try parsing again
  parsedOutput = JSON.parse(cleanOutput);
} catch (err) {
  return res.status(400).json({
    error: "Failed to parse JSON response from Gemini.",
    output, // keep original for debugging
  });
}

console.log(parsedOutput);
    res.json({ questions: parsedOutput });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// answer Route

router.post("/api/questionsresultcalculate", async (req, res) => {
  const { paper } = req.body;
  const jsonString = JSON.stringify(paper);

  console.log(jsonString);

  const prompt = ` ${jsonString} this is list of quetion,options,selectedAnswser and correctAnswer. comparing current quetions selectedAnswser and correctAnswer if they  are same then  then give 1 mark and give me output of total marks  just return only marks no text or symbol     `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AIKEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const output = response.data.candidates[0].content.parts[0].text;
    console.log(output);

    res.send(output);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// creating classCode
router.post("/create/classcode", async (req, res) => {
  const { teacherid, classnname } = req.body;

  const code = Math.random().toString(36).substr(2, 6).toUpperCase();
  const Iscode = await classModel.findOne({ code });
  if (Iscode) {
    res.status(501).json({ message: "Try Again" });
  }
  const newClass = await classModel.create({
    code,
    teacher: teacherid,
    classname: classnname,
  });
  await newClass.save();
  res
    .status(201)
    .json({ message: "Class Code Registered Successfully", result: newClass });
});

// Student Join a Class

router.post("/join/class", async (req, res) => {
  const { classcode, studentid } = req.body;
  const Iscode = await classModel.findOne({ code: classcode });
  const StudentExist = await classStudent.findOne({
    code: classcode,
    student: studentid,
  });
  if (!Iscode) {
    return res.status(501).json({ message: "Class Does Not Exist !!" });
  }
  if (StudentExist) {
    return res.status(501).json({ message: "Already Joined" });
  }
  const newStudent = new classStudent({
    code: classcode,
    student: studentid,
  });
  await newStudent.save();
  res
    .status(200)
    .json({ message: "Successfully Student Added To Class", status: 201 });
});
// uploading syllabus

router.post("/upload/syllabus", async (req, res) => {
  const { classcode, syllabus } = req.body;
  const Iscode = await classModel.findOne({ code: classcode });
  if (!Iscode) {
    return res.status(501).json({ message: "Code Is Incorrect" });
  }
  const newSyllabus = new syllabusModel({
    classCode: classcode,
    topics: syllabus,
  });
  await newSyllabus.save();
  res.status(200).json({ message: "Successfully Uploaded Syllabus" });
});

// create viva
router.post("/create/viva", async (req, res) => {
  const { title, classCode, date, time, totalquetions, status, syllabus, marksPerQuestion } =
    req.body;
  console.log(date);

  const Iscode = await classModel.findOne({ code: classCode });
  if (!title || !classCode || !date || !totalquetions || !status || !time) {
    return res.status(501).json({ message: "All Fields Are Required" });
  }
  if (!Iscode) {
    return res.status(501).json({ message: "Code Is Incorrect" });
  }
  
  // Validate marksPerQuestion
  const marks = marksPerQuestion ? parseInt(marksPerQuestion) : 1;
  if (marks < 1) {
    return res.status(400).json({ message: "Marks per question must be at least 1" });
  }
  
  const newViva = new vivaModel({
    title,
    classCode,
    date,
    totalquetions,
    syllabus,
    time,
    status,
    marksPerQuestion: marks,
  });
  await newViva.save();
  res.status(201).json({ message: "Successfully Viva Created", status: 201 });
});

// When user Take Viva
router.post("/take/vivatest", async (req, res) => {
  console.log("maketrueee!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

  const { classCode, studentId, vivaId, vivaq } = req.body;
  let { answers, score } = req.body;
  answers = typeof answers !== "undefined" ? answers : [];
  score = typeof score !== "undefined" ? score : "0";
  const Iscode = await classModel.findOne({ code: classCode });
  if (!Iscode) {
    return res.status(501).json({ message: "Code Is Incorrect" });
  }
  const IsViva = await vivaModel.findById(vivaId);
  if (!IsViva) {
    return res.status(501).json({ message: "Viva Is Incorrect" });
  }
  const Isstudent = await User.findById({ _id: studentId });
  if (!Isstudent) {
    return res.status(501).json({ message: "Student Is Not Valid" });
  }
  const newVivaResult = new resultModel({
    classCode,
    student: Isstudent._id,
    vivaId,
    vivaq,
    active: "true",
    answers,
    score,
  });
  await newVivaResult.save();
  res
    .status(200)
    .json({ message: "Successfully Result Created", data: newVivaResult });
});

//update status
router.post("/update/status", async (req, res) => {
  const { _id, status, marks, answers } = req.body;
  console.log(_id);

  const updatedUser = await resultModel.findByIdAndUpdate(
    _id, // only the ID here
    { active: false, score: marks, answers }, // fields to update
    { new: true } // optional: returns updated document
  );
  res
    .status(200)
    .json({ message: "Successfully Updated", result: updatedUser });
});

router.post("/get/viva-info", async (req, res) => {
  const { studentId } = req.body;
  try {
    // Step 1: Get all joined class codes
    const joinedClasses = await classStudent.find({ student: studentId });
    const classCodes = joinedClasses.map((j) => j.code);

    if (classCodes.length === 0) {
      return res.status(404).json({ message: "No classes joined" });
    }
    
    // Step 2: Get vivas but exclude "ended" vivas for students
    const vivaRecords = await vivaModel.find({
      classCode: { $in: classCodes },
      status: { $ne: "ended" } // Exclude ended vivas
    });
    
    res.status(200).json({ vivas: vivaRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//get full viva detail from viva id
//user id
router.post("/get/viva-detail", async (req, res) => {
  const { data } = req.body;
  try {
    const Isvivaid = await vivaModel.findOne({ _id: data });
    if (!Isvivaid) {
      return res.status(200).json({ message: "Invalid Viva Try To Access" });
    }
    res.send(Isvivaid);
  } catch (error) {
    return res.status(500).json({ message: "Invalid Viva Try To Access" });
  }
});
// get viva result if exist
router.post("/get/viva-resultexist", async (req, res) => {
  const { student, vivaId } = req.body;
  try {
    console.log(student);
    console.log(vivaId);

    const Isvivaid = await resultModel.findOne({ student, vivaId });
    if (!Isvivaid) {
      return res.status(409).json({ message: "Viva ID not found" });
    }

    res
      .status(200)
      .json({ message: "Viva result ID exists.", result: Isvivaid });
  } catch (error) {
    return res.status(500).json({ message: "Invalid Viva Try To Access" });
  }
});

//teacher

router.post("/get/student", async (req, res) => {
  const { teacherid } = req.body;
  console.log("Teacher ID:", teacherid);
  try {
    const GetTeacher = await classModel.find({ teacher: teacherid });
    if (!GetTeacher) {
      return res.status(501).json({ message: "Invalid Teacher" });
    }
    res.json({ message: GetTeacher });
  } catch (error) {}
});

// NEW: Get teacher classes with student and viva counts
router.post("/get/teacher-classes-with-stats", async (req, res) => {
  const { teacherid } = req.body;
  try {
    const classes = await classModel.find({ teacher: teacherid });
    if (!classes || classes.length === 0) {
      return res.status(200).json({ message: [], totalStats: { totalClasses: 0, totalVivas: 0, totalStudents: 0 } });
    }

    // For each class, get student count and viva count
    const classesWithStats = await Promise.all(
      classes.map(async (classItem) => {
        // Get student count
        const studentCount = await classStudent.countDocuments({ code: classItem.code });
        
        // Get viva count
        const vivaCount = await vivaModel.countDocuments({ classCode: classItem.code });

        return {
          _id: classItem._id,
          classname: classItem.classname,
          code: classItem.code,
          teacher: classItem.teacher,
          time: classItem.time,
          studentCount: studentCount,
          vivaCount: vivaCount,
        };
      })
    );

    // Calculate total stats
    const totalStats = {
      totalClasses: classesWithStats.length,
      totalVivas: classesWithStats.reduce((sum, c) => sum + c.vivaCount, 0),
      totalStudents: classesWithStats.reduce((sum, c) => sum + c.studentCount, 0),
    };

    res.json({ message: classesWithStats, totalStats: totalStats });
  } catch (error) {
    console.error("Error fetching teacher classes with stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: Toggle Viva Status (Start/End Viva)
router.post("/viva/toggle-status", async (req, res) => {
  const { vivaId, status } = req.body;
  try {
    const viva = await vivaModel.findById(vivaId);
    if (!viva) {
      return res.status(404).json({ message: "Viva not found" });
    }

    // Update status - can be "inactive", "active", or "ended"
    viva.status = status;
    await viva.save();

    const statusMessage = status === "active" ? "started" : status === "ended" ? "ended" : "stopped";
    res.json({ success: true, viva: viva, message: `Viva ${statusMessage} successfully` });
  } catch (error) {
    console.error("Error toggling viva status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: Get Viva Monitor Data (for teacher monitoring page)
router.post("/viva/monitor-data", async (req, res) => {
  const { vivaId } = req.body;
  try {
    // Get viva details
    const viva = await vivaModel.findById(vivaId);
    if (!viva) {
      return res.status(404).json({ message: "Viva not found" });
    }

    // Get class info
    const classInfo = await classModel.findOne({ code: viva.classCode });
    const className = classInfo ? classInfo.classname : viva.classCode;

    // Get all students in the class
    const classStudents = await classStudent.find({ code: viva.classCode });
    
    // Get all student details
    const studentIds = classStudents.map(s => s.student);
    const students = await User.find({ _id: { $in: studentIds } });

    // Get all results for this viva
    const results = await resultModel.find({ vivaId: vivaId });
    console.log("Results found:", results.length);
    if (results.length > 0) {
      console.log("Sample result:", {
        active: results[0].active,
        score: results[0].score,
        student: results[0].student
      });
    }

    // Combine student data with results
    const studentData = students.map(student => {
      const result = results.find(r => r.student.toString() === student._id.toString());
      
      // Determine status based on result
      let status = "not-submitted";
      if (result) {
        if (result.active === true) {
          status = "in-progress";
        } else if (result.active === false) {
          status = "submitted";
        }
      }
      
      return {
        _id: student._id,
        name: student.name,
        enrollment: student.ennumber,
        email: student.email,
        status: status,
        marks: result && result.active === false ? result.score : null, // Use 'score' field from database
        submittedAt: result && result.active === false ? result.updatedAt : null,
      };
    });

    res.json({
      success: true,
      viva: {
        _id: viva._id,
        title: viva.title,
        time: viva.time,
        totalquetions: viva.totalquetions,
        classCode: viva.classCode,
        status: viva.status,
        date: viva.date,
        syllabus: viva.syllabus,
        marksPerQuestion: viva.marksPerQuestion || 1,
      },
      className: className,
      students: studentData,
      stats: {
        total: studentData.length,
        submitted: studentData.filter(s => s.status === "submitted").length,
        inProgress: studentData.filter(s => s.status === "in-progress").length,
        notStarted: studentData.filter(s => s.status === "not-submitted").length,
      }
    });
  } catch (error) {
    console.error("Error fetching viva monitor data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get viva by class code

router.post("/get/vivavbyclasscode", async (req, res) => {
  const { classCode } = req.body;
  try {
    const Isvivaid = await vivaModel.find({ classCode });
    if (!Isvivaid) {
      return res.status(200).json({ message: "Invalid Viva Try To Access" });
    }
    res.send(Isvivaid);
  } catch (error) {
    return res.status(500).json({ message: "Invalid Viva Try To Access" });
  }
});

// get student by classCode

router.post("/get/studentinclass", async (req, res) => {
  const { classCode } = req.body;
  try {
    const Isstudent = await classStudent.find({ code: classCode });
    if (!Isstudent) {
      return res.status(200).json({ message: "Invalid Viva Try To Access" });
    }
    res.send(Isstudent);
  } catch (error) {
    return res.status(500).json({ message: "Invalid Viva Try To Access" });
  }
});

//find all users

router.post("/get/allstudentinclass", async (req, res) => {
  const { _id } = req.body;
  try {
    const Isvivaid = await User.find({ _id: { $in: _id } });
    if (!Isvivaid) {
      return res.status(200).json({ message: "Invalid Ids" });
    }

    res.send(Isvivaid);
  } catch (error) {
    return res.status(500).json({ message: "Invalid Viva Try To Access" });
  }
});

//update viva

router.post("/update/vivadetail", async (req, res) => {
  const { id, title, date, time, totalquetions, status, syllabus, marksPerQuestion } = req.body;

  // Check required fields
  if (!id || !title || !date || !time || !totalquetions || !status) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }

  try {
    const viva = await vivaModel.findById({ _id: id });
    if (!viva) {
      return res.status(404).json({ message: "Viva Not Found" });
    }

    // Validate marksPerQuestion if provided
    if (marksPerQuestion !== undefined) {
      const marks = parseInt(marksPerQuestion);
      if (marks < 1) {
        return res.status(400).json({ message: "Marks per question must be at least 1" });
      }
      viva.marksPerQuestion = marks;
    }

    // Update fields
    viva.title = title;
    viva.date = date;
    viva.totalquetions = totalquetions;
    viva.time = time;
    viva.status = status;
    viva.syllabus = syllabus;
    await viva.save();

    res.status(200).json({ message: "Viva Updated Successfully", viva });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Updating Viva", error: error.message });
  }
});

// teacher side get all student marks from classcode & student

router.post("/get/studentinresult", async (req, res) => {
  const { classCode, student } = req.body;
  try {
    const Isstudent = await resultModel.find({ classCode, student });
    if (!Isstudent) {
      return res.status(200).json({ message: "No Student In Class" });
    }
    res.send(Isstudent);
  } catch (error) {
    return res.status(500).json({ message: "Error In Geting student result" });
  }
});

//get all viva

router.get("/get/all-viva", async (req, res) => {
  try {
    const Isvivaid = await vivaModel.find();
    if (!Isvivaid) {
      return res.status(200).json({ message: "Find  Viva No" });
    }
    res.send(Isvivaid);
  } catch (error) {
    return res.status(500).json({ message: "Error Catch Block" });
  }
});
router.post("/get/all-vivaresult", async (req, res) => {
  const { vivaId } = req.body;
  try {
    const IsresultId = await resultModel.find({ vivaId });
    if (!IsresultId) {
      return res.status(200).json({ message: "No Viva Exist" });
    }
    res.send(IsresultId);
  } catch (error) {
    return res.status(500).json({ message: "Error Catch Block" });
  }
});
router.post("/get/analytics", async (req, res) => {
  try {
    const { teacherId } = req.body;

    // 1. Find all classes of this teacher
    const classes = await classModel.find({ teacher: teacherId });

    if (!classes.length) {
      return res
        .status(404)
        .json({ message: "No classes found for this teacher" });
    }

    // 2. For each class, get all viva results and manually fetch student data
    const classData = await Promise.all(
      classes.map(async (cls) => {
        const results = await resultModel
          .find({ classCode: cls.code })
          .lean();

        // Manually fetch student data since student field is String, not ObjectId
        const studentsWithData = await Promise.all(
          results.map(async (r) => {
            try {
              // Fetch student data using the student ID string
              const studentData = await User.findById(r.student).lean();
              
              return {
                studentId: r.student,
                name: studentData?.name || "Unknown Student",
                enrollment: studentData?.ennumber || "N/A",
                email: studentData?.email || "N/A",
                score: r.score || 0,
              };
            } catch (error) {
              console.error("Error fetching student:", r.student, error);
              return {
                studentId: r.student,
                name: "Unknown Student",
                enrollment: "N/A",
                email: "N/A",
                score: r.score || 0,
              };
            }
          })
        );

        return {
          classId: cls._id,
          classname: cls.classname,
          code: cls.code,
          totalStudents: studentsWithData.length,
          students: studentsWithData,
        };
      })
    );

    // 3. Send analytics response
    res.json({
      teacherId,
      totalClasses: classes.length,
      classes: classData,
    });
  } catch (err) {
    console.error("Error in getTeacherAnalytics:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete class and all associated data
router.post("/delete/class", async (req, res) => {
  const { classCode } = req.body;
  
  if (!classCode) {
    return res.status(400).json({ message: "Class code is required" });
  }

  try {
    // Check if class exists
    const classExists = await classModel.findOne({ code: classCode });
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Delete all vivas associated with this class
    const vivasDeleted = await vivaModel.deleteMany({ classCode: classCode });
    
    // Delete all results associated with this class
    const resultsDeleted = await resultModel.deleteMany({ classCode: classCode });
    
    // Delete all student enrollments in this class
    const studentsDeleted = await classStudent.deleteMany({ code: classCode });
    
    // Delete all syllabus entries for this class
    const syllabusDeleted = await syllabusModel.deleteMany({ classCode: classCode });
    
    // Finally, delete the class itself
    await classModel.deleteOne({ code: classCode });

    res.status(200).json({ 
      message: "Class and all associated data deleted successfully",
      deleted: {
        vivas: vivasDeleted.deletedCount,
        results: resultsDeleted.deletedCount,
        students: studentsDeleted.deletedCount,
        syllabus: syllabusDeleted.deletedCount,
      }
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
