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

Only return a valid JSON array of objects (not a string or code block), using double quotes ("") for all keys and values. Do not add any text before or after the array. Only output the array.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AIKEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const output = response.data.candidates[0].content.parts[0].text;

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(output);
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Failed to parse JSON response from Gemini.", output });
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
  const { title, classCode, date, time, totalquetions, status, syllabus } =
    req.body;
  console.log(date);

  const Iscode = await classModel.findOne({ code: classCode });
  if (!title || !classCode || !date || !totalquetions || !status || !time) {
    return res.status(501).json({ message: "All Fields Are Required" });
  }
  if (!Iscode) {
    return res.status(501).json({ message: "Code Is Incorrect" });
  }
  const newViva = new vivaModel({
    title,
    classCode,
    date,
    totalquetions,
    syllabus,
    time,
    status,
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
    const vivaRecords = await vivaModel.find({
      classCode: { $in: classCodes },
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
  const { id, title, date, time, totalquetions, status, syllabus } = req.body;

  // Check required fields
  if (!id || !title || !date || !time || !totalquetions || !status) {
    return res.status(400).json({ message: "All Fields Are Required" });
  }

  try {
    const viva = await vivaModel.findById({ _id: id });
    if (!viva) {
      return res.status(404).json({ message: "Viva Not Found" });
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

    // 2. For each class, get all viva results + populate student
    const classData = await Promise.all(
      classes.map(async (cls) => {
        const results = await resultModel
          .find({ classCode: cls.code })
          .populate("student", "name rollNo email") // adjust fields as per your Student schema
          .lean();

        return {
          classId: cls._id,
          classname: cls.classname,
          code: cls.code,
          totalStudents: results.length,
          students: results.map((r) => ({
            studentId: r.student?._id,
            name: r.student?.name,
            rollNo: r.student?.rollNo,
            score: r.score,
          })),
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
export default router;
