import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import "../CSS/result.css";

const Studentresult = () => {
  const [VivaResult, SetVivaResult] = useState([]);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    enrollment: "",
    correctAnswers: 0,
    totalQuestions: 0,
    actualScore: 0,
    totalPossibleMarks: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const result = JSON.parse(localStorage.getItem("vivaresult"));
      const storedStudentInfo = JSON.parse(localStorage.getItem("studentInfo"));

      SetVivaResult(result);

      if (result && result.length > 0) {
        const correct = result.filter((q) => {
          // Normalize both answers for comparison - handles case sensitivity, whitespace, and data types
          const selectedAnswer = String(q.selectedAnswer || "")
            .trim()
            .toLowerCase();
          const correctAnswer = String(q.correctAnswer || "")
            .trim()
            .toLowerCase();
          return selectedAnswer === correctAnswer;
        }).length;

        // Calculate total possible marks
        const marksPerQuestion = storedStudentInfo?.marksPerQuestion || 1;
        const totalPossible = result.length * marksPerQuestion;

        setStudentInfo({
          name: storedStudentInfo?.name || "Student Name",
          enrollment: storedStudentInfo?.enrollment || "Enrollment Number",
          correctAnswers: correct,
          totalQuestions: result.length,
          // Use the actual score from database (this matches the modal)
          actualScore: storedStudentInfo?.score || 0,
          totalPossibleMarks: totalPossible,
        });
      }
    } catch (error) {
      console.error("Error loading viva result:", error);
    }
  }, []);

  return (
    <div className="simple-result-container">
      {/* Simple Header */}
      <div className="simple-result-header">
        <button onClick={() => navigate(-1)} className="simple-back-btn">
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="simple-student-info">
          <h2>{studentInfo.name}</h2>
          <p>Enrollment: {studentInfo.enrollment}</p>
          <p className="simple-score">
            Score: {studentInfo.actualScore}/{studentInfo.totalPossibleMarks} marks ({studentInfo.correctAnswers}
            /{studentInfo.totalQuestions} correct)
          </p>
        </div>
      </div>

      {/* Simple Questions */}
      <div className="simple-questions">
        {VivaResult.map((q, index) => (
          <div key={index} className="simple-question-card">
            <h4>
              Q{index + 1}. {q.question}
            </h4>

            <div className="simple-options">
              {Object.entries(q.options).map(([key, value]) => {
                let className = "simple-option";
                let icon = null;

                if (q.selectedAnswer === key) {
                  if (key === q.correctAnswer) {
                    className += " correct-answer";
                    icon = <CheckCircle size={16} />;
                  } else {
                    className += " wrong-answer";
                    icon = <XCircle size={16} />;
                  }
                } else if (
                  key === q.correctAnswer &&
                  q.selectedAnswer !== q.correctAnswer
                ) {
                  className += " correct-highlight";
                  icon = <AlertCircle size={16} />;
                }

                return (
                  <div key={key} className={className}>
                    <span className="option-key">{key.toUpperCase()}:</span>
                    <span className="option-text">{value}</span>
                    {icon && <span className="option-icon">{icon}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studentresult;
