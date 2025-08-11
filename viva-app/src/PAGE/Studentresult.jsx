import React, { useEffect, useState } from "react";
import "../CSS/result.css";

const Studentresult = () => {
  const [VivaResult, SetVivaResult] = useState([]);

  useEffect(() => {
    try {
      const result = JSON.parse(localStorage.getItem("vivaresult"));
      SetVivaResult(result);
    } catch (error) {}
  }, []);

  return (
    <div className="quiz-container">
      {VivaResult.map((q, index) => (
        <div key={index} className="question-block">
          <h4>
            {index + 1}. {q.question}
          </h4>
          <div className="options">
            {Object.entries(q.options).map(([key, value]) => {
              let className = "option";

              if (q.selectedAnswer === key) {
                className += key === q.correctAnswer ? " correct" : " wrong";
              } else if (
                key === q.correctAnswer &&
                q.selectedAnswer !== q.correctAnswer
              ) {
                className += " highlight-correct";
              }

              return (
                <div key={key} className={className}>
                  {key.toUpperCase()}: {value}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Studentresult;
