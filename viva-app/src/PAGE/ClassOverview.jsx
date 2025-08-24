import React from "react";
import "../CSS/classoverview.css";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFileImport,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Studentresult from "./Studentresult";
import { useDispatch } from "react-redux";
import { addstudentresult } from "../REDUX/UserSlice";
const ClassOverview = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { teacherclasscodeid } = useParams();
  const [vivaItem, setvivaItem] = useState([]);
  const [messagedisplay, setMessgeDisplay] = useState(null);
  const [mainVivaItem, setmainVivaItem] = useState([]);
  const [studentResultItem, setstudentResultItem] = useState([]);
  const [studentBasic, setstudentBasic] = useState([]);
  const [vivaNameList, setvivaNameList] = useState([]);
  const [popupStatus, setpopupStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [studentResultStatus, setstudentResultStatus] = useState(false);
  const [vivaIDS, SetVivaIds] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [exelData, setExelData] = useState([]);
  const [exelDataResult, setExelDataResult] = useState([]);
  const [value, setValue] = useState("");
  const [relode, setRelode] = useState("");
  const [downloadCount, setDownloadCount] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    totalquetions: "",
    time: "",
    syllabus: "",
  });
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        window.location.href = "/login";
      }
      const response = await fetch(
        "https://vivabackend.onrender.com/bin/getUsername",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorlogin(errorData.message);
      }

      const data = await response.json();

      if (data.payload.role != 1) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    try {
      const FetchData = async () => {
        const response = await fetch(
          "https://vivabackend.onrender.com/bin/get/studentinclass",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ classCode: teacherclasscodeid }),
          }
        );
        const data = await response.json();

        if (data) {
          ///get/allstudentinclass
          const idList = data.map((s) => s.student);

          const allstudent = await fetch(
            "https://vivabackend.onrender.com/bin/get/allstudentinclass",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: idList }),
            }
          );
          const Filterstudents = await allstudent.json();
          setStudentData(Filterstudents);
        }
      };
      FetchData();
    } catch (error) {}
  }, [teacherclasscodeid]);

  useEffect(
    () => {
      try {
        const FetchData = async () => {
          const response = await fetch(
            "https://vivabackend.onrender.com/bin/get/vivavbyclasscode",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ classCode: teacherclasscodeid }),
            }
          );
          const data = await response.json();
          setvivaItem(data);
          setmainVivaItem(data);
        };
        FetchData();
      } catch (error) {}
    },
    [teacherclasscodeid],
    [relode]
  );

  const HandleUpcoming = (e) => {
    e.preventDefault();
    if (mainVivaItem.length > 0) {
      const filteredArray = mainVivaItem.filter(
        (data) => data.status == "false"
      );
      setvivaItem(filteredArray);
      setMessgeDisplay();
      if (filteredArray.length <= 0) {
        setMessgeDisplay("No Upcoming Viva");
      }
    }
  };
  const HandleContinue = (e) => {
    e.preventDefault();
    if (mainVivaItem.length > 0) {
      const filteredArray = mainVivaItem.filter(
        (data) => data.status == "true"
      );
      setvivaItem(filteredArray);
      setMessgeDisplay();
      if (filteredArray.length <= 0) {
        setMessgeDisplay("No Continue Viva");
      }
    }
  };

  const HandleCreate = () => {
    setpopupStatus(true);
    setFormData({
      title: "",
      date: "",
      totalquetions: "",
      time: "",
      syllabus: "",
    });
  };
  const HandleFalse = () => {
    setpopupStatus(false);
  };
  const HandleCreteViva = async (e) => {
    e.preventDefault();
    console.log(formData);
    //  const { title, classCode, date,time,totalquetions, status,syllabus } = req.body;
    const response = await fetch(
      "https://vivabackend.onrender.com/bin/create/viva",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          classCode: teacherclasscodeid,
          date: formData.date,
          time: formData.time,
          totalquetions: formData.totalquetions,
          status: "false",
          syllabus: formData.syllabus,
        }),
      }
    );
    if (response.status !== 201) {
      const error = await response.json();
      toast.error(error.message);
      return;
    }
    const data = await response.json();
    console.log(data);
    toast.success(data.message);
  };
  const HandleInputchange = (e) => {
    const { name, value } = e.target;

    if (name == "date") {
      const stringdata = value.toString();
      setFormData((prevData) => ({
        ...prevData,
        [name]: stringdata,
      }));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log("else");
  };
  const HandleSetinput = (data, e) => {
    setFormData({
      title: data.title,
      date: data.date,
      totalquetions: data.totalquetions,
      time: data.time,
      syllabus: data.syllabus,
    });
    SetVivaIds(data._id);

    setUpdateStatus(true);
  };
  const handleChange = (e) => {
    setValue(e.target.value === "true"); // convert string to boolean
  };

  const HandleUpdate = async () => {
    setRelode("1");
    try {
      console.log(value);
      const UpdateViva = await fetch(
        "https://vivabackend.onrender.com/bin/update/vivadetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: vivaIDS,
            title: formData.title,
            date: formData.date,
            time: formData.time,
            totalquetions: formData.totalquetions,
            status: value || "false",
            syllabus: formData.syllabus,
          }),
        }
      );
      const updated = await UpdateViva.json();
      if (!UpdateViva.ok) {
      }
      setUpdateStatus(false);
    } catch (error) {}
  };
  const DateFunc = (data) => {
    return data.split("T")[0];
  };
  const HandleViewStudent = async (data, e) => {
    //data._id //teacherclasscodeid

    setstudentBasic({
      student: data.name,
      ennumber: data.ennumber,
      email: data.email,
    });

    try {
      const response = await fetch(
        "https://vivabackend.onrender.com/bin/get/studentinresult",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classCode: teacherclasscodeid,
            student: data._id,
          }),
        }
      );
      const Data = await response.json();

      const responseViva = await fetch(
        "https://vivabackend.onrender.com/bin/get/all-viva",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const Dataviva = await responseViva.json();
      if (Data) {
        const vivaname = Dataviva.filter((item) => item._id == Data.vivaId);

        setvivaNameList(vivaname);
        setstudentResultItem(Data);
      }
    } catch (error) {}
    setstudentResultStatus(true);
    e.preventDefault();
  };

  const HandleDownloadExel = (e) => {
    e.preventDefault();
    console.log(exelData);

    if (studentResultItem.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(exelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate buffer and create download link
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_individual_result.xlsx";
      a.click();
      URL.revokeObjectURL(url);
      setExelData([]);
    }
  };

  const HandleDownloadvivaexelresult = async (e, data) => {
    e.preventDefault();
    const vivaname = data.title;

    try {
      const responseViva = await fetch(
        "https://vivabackend.onrender.com/bin/get/all-vivaresult",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vivaId: data._id }),
        }
      );
      const Dataviva = await responseViva.json();

      Dataviva.map((data) => {
        const newdata = studentData.filter((std) => std._id == data.student);
        exelDataResult.push({
          Viva: vivaname,
          Name: newdata[0].name,
          Enrollment_num: newdata[0].ennumber,
          Email: newdata[0].email,
          Marks: data.score,
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(exelDataResult);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate buffer and create download link
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${vivaname}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setExelDataResult([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="MainDiv">
        {popupStatus && (
          <div className="popup">
            <p onClick={() => HandleFalse()}>X</p>
            <h2>Create Viva</h2>
            <input
              type="text"
              placeholder="Enter Title"
              name="title"
              value={formData.title}
              onChange={HandleInputchange}
            />
            <input
              type="date"
              placeholder="Enter Date"
              name="date"
              value={formData.date}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Total Quetions"
              name="totalquetions"
              value={formData.totalquetions}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Time For Viva"
              name="time"
              value={formData.time}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Syllabus"
              name="syllabus"
              value={formData.syllabus}
              onChange={HandleInputchange}
            />
            <button onClick={(e) => HandleCreteViva(e)}>CREATE</button>
          </div>
        )}
        {updateStatus && (
          <div className="popup">
            <p onClick={() => setUpdateStatus(false) & SetVivaIds("")}>X</p>
            <h2>Update Viva</h2>
            <input
              type="text"
              placeholder="Enter Title"
              name="title"
              value={formData.title}
              onChange={HandleInputchange}
            />
            <input
              type="date"
              placeholder="Enter Date"
              name="date"
              value={formData.date}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Total Quetions"
              name="totalquetions"
              value={formData.totalquetions}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Time For Viva"
              name="time"
              value={formData.time}
              onChange={HandleInputchange}
            />
            <input
              type="text"
              placeholder="Enter Syllabus"
              name="syllabus"
              value={formData.syllabus}
              onChange={HandleInputchange}
            />
            <h5>Select Option:</h5>
            <div className="flexx">
              <label>
                <input
                  type="radio"
                  value="true"
                  checked={value === true}
                  onChange={handleChange}
                />
                Active
              </label>

              <label>
                <input
                  type="radio"
                  value="false"
                  checked={value === false}
                  onChange={handleChange}
                />
                Not Active
              </label>
            </div>

            <button onClick={(e) => HandleUpdate(e)}>UPDATE VIVA</button>
          </div>
        )}
        {studentResultStatus && (
          <>
            <div className="resultpopup">
              <button onClick={(e) => HandleDownloadExel(e)}>
                Download Exel
              </button>
              <div
                className="crossresult"
                onClick={() => setstudentResultStatus(false)}
              >
                <p>X</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Student-Name</th>
                    <th>Student-Enrollment</th>
                    <th>Student-VivaName</th>
                    <th>Student-marks</th>
                    <th>Task</th>
                  </tr>
                </thead>

                <tbody>
                  {studentResultItem.length > 0 &&
                    studentResultItem.map((data, i) => {
                      const vivaname = vivaItem.filter(
                        (res) => res._id == data.vivaId
                      );

                      if (downloadCount === true) {
                        exelData.push({
                          Name: studentBasic.student,
                          "Enrollment-Number": studentBasic.ennumber,
                          Email: studentBasic.email,
                          Viva: vivaname[0].title,
                          Marks: data.score,
                        });
                        setDownloadCount(false);
                      }

                      return (
                        <tr key={i}>
                          <td>{studentBasic.student}</td>
                          <td>{studentBasic.ennumber}</td>
                          <td>{vivaname[0].title}</td>
                          <td>{data.score}</td>
                          <td style={{ overflow: "visible" }}>
                            <Link
                              to="/class/overview/studentresult"
                              style={{
                                padding: "8px 18px",
                                border: "none",
                                cursor: "pointer",
                                color: "#7b5cff",
                                textDecoration: "underline",
                              }}
                              onClick={() =>
                                localStorage.setItem(
                                  "vivaresult",
                                  JSON.stringify(data.answers)
                                )
                              }
                            >
                              Result
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="uppr">
          <p>Class- {teacherclasscodeid}</p>
          <p>
            {studentData.length > 0
              ? "Joined Student : " + studentData.length
              : "No Student Joined Yet !"}
          </p>
        </div>
        <div className="lowers">
          <button style={{ fontSize: "1.2rem" }} onClick={() => HandleCreate()}>
            Create New Viva{" "}
            <FontAwesomeIcon
              icon={faFileImport}
              style={{ color: "#ffffffd3" }}
            />
          </button>
          <div className="cardcontainer">
            <div className="btn2">
              <button onClick={(e) => HandleUpcoming(e)}>UpComing</button>
              <button onClick={(e) => HandleContinue(e)}>Continue</button>
              <button>Previous</button>
            </div>
            {vivaItem.length > 0 &&
              vivaItem.map((data, i) => {
                return (
                  <div className="cards" key={i}>
                    <div className="top">
                      <p>{data.title}</p>
                      <button onClick={(e) => HandleSetinput(data, e)}>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: "#62686ed3", cursor: "pointer" }}
                        />
                      </button>
                      <button
                        onClick={(e) => HandleDownloadvivaexelresult(e, data)}
                      >
                        <FontAwesomeIcon icon={faFileArrowDown} />
                      </button>
                    </div>
                    <div className="content">
                      <p>Date: {data.date}</p>
                      <p>Quetion: {data.totalquetions}</p>
                      <p>Duration: {data.time}MIN</p>
                      {data.status === "true" ? (
                        <p style={{ color: "green" }}>status:Active</p>
                      ) : (
                        <p style={{ color: "red" }}>status: not active</p>
                      )}
                    </div>
                    <button>Start-Viva</button>
                  </div>
                );
              })}
            {messagedisplay && <h1>{messagedisplay}</h1>}
          </div>
        </div>
      </main>
      <div className="student">
        <div className="uppr">
          <p>Joined Student in #{teacherclasscodeid}</p>
        </div>
        <div className="lowers">
          <table>
            <thead>
              <tr>
                <th>Student-Name</th>
                <th>Student-Enrollment</th>
                <th>Student-Joined</th>
                <th>Student-Mail</th>
                <th>Student-Result</th>
              </tr>
            </thead>

            <tbody>
              {studentData.length > 0 &&
                studentData.map((data, i) => {
                  return (
                    <tr key={i}>
                      <td>{data.name}</td>
                      <td>{data.ennumber}</td>
                      <td>{DateFunc(data.createdAt)}</td>
                      <td>{data.email}</td>
                      <td>
                        <button onClick={(e) => HandleViewStudent(data, e)}>
                          VIEW
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

//tittle,date,totalq
//https://vivabackend.onrender.com/bin/get/vivavbyclasscode

export default ClassOverview;
