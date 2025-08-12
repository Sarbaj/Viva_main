import React, { useEffect, useRef, useState } from "react";
import "../CSS/vivatest.css";
import { useSelector } from "react-redux";

const VivaTest = () => {
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const intervalRef = useRef(null);
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const { UserInfo } = useSelector((state) => state.user);
  const [userid, setUserId] = useState("");
  const [vivaMainid, setvivaMainid] = useState("");
  const [VivaResultId, setVivaResultId] = useState("");
  const [DataQuet, SetDataQuet] = useState([]);
  const [FinalQuetion, setFinalQuetion] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [load, setLoad] = useState(true);
  const [done, setDone] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUserId(UserInfo[0].payload._id);
      if (UserInfo[0].payload.role != 0) {
        window.location.href = "/login";
      }
    }
  }, [UserInfo]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);

    const updatedQuestions = [...FinalQuetion];
    updatedQuestions[index].answer = value;
    setFinalQuetion(updatedQuestions);
  };
  function openFullscreen(element) {
    if (!element) {
      element = document.documentElement; // Default to whole page
    }

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE11 */
      element.msRequestFullscreen();
    }
  }

  openFullscreen();
  const handleSubmit = async () => {
    alert("submited");
    ///api/questionsresultcalculate
    // const data = FinalQuetion.map((q, i) => ({
    //   question: q.question,
    //   options: q.options,
    //   selectedAnswer: userAnswers[i] || "Not Answered",
    //   correctAnswer: q.answer,
    // }));
    // let marks = 0;
    // console.log(data);
    // data.forEach((q) => {
    //   if (q.selectedAnswer === q.correctAnswer) {
    //     marks++;
    //   }
    // });
    // setSubmittedData(data);
    // const _id = vivaMainid;
    // try {
    //   const UpdateResul = await fetch(
    //     "https://vivabackend.onrender.com/bin/update/status",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         _id,
    //         status: false,
    //         marks: marks,
    //         answers: data,
    //       }),
    //     }
    //   );
    //   setFinalQuetion([]);
    //   const res = await UpdateResul.json();
    //   window.location.href = "/";
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const HandleGenrateQ = async (data) => {
    //  https://vivabackend.onrender.com/bin/get/viva-resultexist

    try {
      const VivaExistInResult = await fetch(
        "https://vivabackend.onrender.com/bin/get/viva-resultexist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vivaId: data._id, student: userid }),
        }
      );
      const Data = await VivaExistInResult.json();
      const status = VivaExistInResult.status;

      if (Data.result) {
        if (Data.result.active === false && Data.result.student == userid) {
          setFinalQuetion([]);
          setDone(true);
          localStorage.removeItem("quizEndTs");
        }
        if (Data.result.active === true && Data.result.student == userid) {
          setLoad(false);
          setFinalQuetion(Data.result.vivaq);
          const existingEndTs = localStorage.getItem("quizEndTs");

          if (!existingEndTs || Date.now() > parseInt(existingEndTs)) {
            const oneMinuteMs = data.time * 60 * 1000;
            const endTs = Date.now() + oneMinuteMs;
            localStorage.setItem("quizEndTs", endTs);
            setTimeLeft(data.time * 60); // or time in seconds based on viva
          } else {
            const remaining = Math.floor(
              (parseInt(existingEndTs) - Date.now()) / 1000
            );
            setTimeLeft(remaining);
          }

          setvivaMainid(Data.result._id);
        }
        setUserId(Data.result.student);

        setvivaMainid(Data.result._id);
      }

      if (Data.result) {
        setVivaResultId(Data.result._id);
      }

      if (status === 409) {
        //// if viva does not Exist

        const responseQuetion = await fetch(
          "https://vivabackend.onrender.com/bin/api/questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              syllabus: data.syllabus,
              totalq: data.totalquetions,
            }),
          }
        );

        setVivaResultId(data._id);

        const existingEndTs = localStorage.getItem("quizEndTs");
        if (!existingEndTs || Date.now() > parseInt(existingEndTs)) {
          const Time = Number(data.time) * 60 * 1000;
          const endTs = Date.now() + Time;
          localStorage.setItem("quizEndTs", endTs);
          setTimeLeft(data.time * 60); // or time in seconds based on viva
        } else {
          const remaining = Math.floor(
            (parseInt(existingEndTs) - Date.now()) / 1000
          );
          setTimeLeft(remaining);
        }
        const DataQ = await responseQuetion.json();
        setLoad(false);

        // const text=DataQ.output;
        //   const cleaned = text
        //   .replace(/^```json\s*/, '')  // remove ```json at start
        //   .replace(/```$/, '')         // remove ``` at end
        //   .trim();
        //   const fixed = cleaned.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
        //   const questionArray = JSON.parse(fixed);
        setFinalQuetion(DataQ.questions);

        const PostResultData = await fetch(
          "https://vivabackend.onrender.com/bin/take/vivatest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              classCode: data.classCode,
              studentId: userid,
              vivaId: data._id,
              vivaq: DataQ.questions,
            }),
          }
        );
        const Empp = await PostResultData.json();

        // if no viva in result endddd

        setvivaMainid(Empp.data._id);
      }
      if (Data.result) {
        if (Data.result.active === false && Data.result.student == userid) {
          setFinalQuetion([]);
          setLoad(false);
          alert("Already Submited");
          window.location.href = "/";
        }
        if (Data.result.active === true && Data.result.student == userid) {
          const existingEndTs = localStorage.getItem("quizEndTs");
          if (!existingEndTs || Date.now() > parseInt(existingEndTs)) {
            const Time = data.time * 60 * 1000;
            const endTs = Date.now() + Time;
            localStorage.setItem("quizEndTs", endTs);
            setTimeLeft(data.time * 60); // or time in seconds based on viva
          } else {
            const remaining = Math.floor(
              (parseInt(existingEndTs) - Date.now()) / 1000
            );
            setTimeLeft(remaining);
          }
        }
        setUserId(Data.result.student);
        setvivaMainid(Data.result._id);
      }

      ///get/viva-resultexist"
    } catch (error) {}
  };
  useEffect(() => {
    const storedEndTs = localStorage.getItem("quizEndTs");

    if (storedEndTs) {
      const remaining = Math.floor((parseInt(storedEndTs) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        // Time expired
        localStorage.removeItem("quizEndTs");
        setTimeLeft(0);
        // Optional: handle auto-submit here
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          localStorage.removeItem("quizEndTs");

          // 🚨 Auto-submit if not already submitted
          if (!submitted) {
            //  handleSubmit();
            // setSubmitted(true);
            handleSubmit();
            setDone(true);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, submitted]);

  useEffect(() => {
    const GetVivaFunc = async () => {
      try {
        const VivaId = localStorage.getItem("VivaId");
        const response = await fetch(
          "https://vivabackend.onrender.com/bin/get/viva-detail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: VivaId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
        }
        const data = await response.json();

        if (userid) {
          HandleGenrateQ(data);
        }
      } catch (e) {
        console.log("error");
      }
    };
    GetVivaFunc();
  }, [userid]);

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  // document.addEventListener('keydown', function (e) {
  //   if (
  //     e.key === 'F12' ||
  //     (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
  //     (e.ctrlKey && e.key === 'U')
  //   ) {
  //     e.preventDefault();
  //   }
  // });
  function startTabFocusMonitor(callback) {
    const interval = setInterval(() => {
      if (document.hidden) {
        callback("inactive"); // User left the tab or minimized
      } else {
        callback("active"); // User is on the tab
      }
    }, 1000); // Every second

    return () => clearInterval(interval); // returns a cleanup function
  }

  useEffect(() => {
    const stopMonitoring = startTabFocusMonitor((status) => {
      if (status === "inactive") {
        alert("Form Is Submited Because You Left The Tab 🚨");
        setTimeLeft(2);

        // Optional: increase count, warn, or auto-submit
      }
    });

    return () => stopMonitoring(); // cleanup on unmount
  }, []);

  let minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  let seconds = String(timeLeft % 60).padStart(2, "0");
  const optionChange = (index, selectedOption) => {
    setUserAnswers({ ...userAnswers, [index]: selectedOption });
  };

  const userSubmit = () => {
    const newData = FinalQuetion.map((q, i) => ({
      question: q.question,
      options: q.options,
      selectedAnswer: userAnswers[i] || "Not Answered",
    }));

    setSubmitted(true);
    setSubmittedData(newData);
    console.log("Submitted Data:", newData);
  };

  return (
    <div className="viva-container">
      <h2 className="viva-title">📝 Viva Test</h2>
      <div className="timestyle">
        {FinalQuetion.length > 0 && (
          <p>
            ⏳ Time Remaining:{" "}
            <strong>
              {minutes}:{seconds}
            </strong>
          </p>
        )}
      </div>

      {FinalQuetion.length > 0 &&
        FinalQuetion.map((q, i) => (
          <div key={i} className="viva-question-block">
            <p className="viva-question">
              {i + 1}. {q.question}
            </p>
            <div className="viva-options">
              {Object.entries(q.options).map(([key, value]) => (
                <label
                  key={key}
                  className={`viva-option-label ${
                    submitted && userAnswers[i] === key ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={key}
                    checked={userAnswers[i] === key}
                    onChange={() => optionChange(i, key)}
                    disabled={submitted}
                  />
                  <span className="option-letter">{key}.</span> {value}
                </label>
              ))}
            </div>
          </div>
        ))}
      {done ? (
        <>
          <h1>You Have Successfully Submited Your Viva Assigment</h1>
        </>
      ) : (
        <>
          <h1></h1>
        </>
      )}
      {load && <h1>Loading..</h1>}
      {FinalQuetion.length > 0 && (
        <>
          <button className="viva-submit-btn" onClick={() => handleSubmit()}>
            Submit Viva
          </button>
        </>
      )}
    </div>
  );
};

export default VivaTest;
