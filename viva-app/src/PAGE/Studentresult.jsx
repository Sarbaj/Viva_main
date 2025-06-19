import React, { useEffect, useState } from "react";
import '../CSS/result.css';


const questions = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Rome"],
    correctAnswer: "Paris",
    selectedAnswer: "Berlin"
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "2", "5"],
    correctAnswer: "4",
    selectedAnswer: "4"
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correctAnswer: "JavaScript",
    selectedAnswer: "Python"
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
    selectedAnswer: "Cascading Style Sheets"
  },
  {
    question: "What year was JavaScript launched?",
    options: ["1996", "1995", "1994", "None"],
    correctAnswer: "1995",
    selectedAnswer: "1996"
  },
  {
    question: "Which tag is used in HTML for JavaScript?",
    options: ["<script>", "<js>", "<javascript>", "<code>"],
    correctAnswer: "<script>",
    selectedAnswer: "<script>"
  },
  {
    question: "React is a ___?",
    options: ["Framework", "Library", "Language", "Compiler"],
    correctAnswer: "Library",
    selectedAnswer: "Framework"
  },
  {
    question: "How do you write a comment in CSS?",
    options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"],
    correctAnswer: "/* comment */",
    selectedAnswer: "# comment"
  },
  {
    question: "Which HTML tag is used for table rows?",
    options: ["<td>", "<tr>", "<th>", "<table>"],
    correctAnswer: "<tr>",
    selectedAnswer: "<tr>"
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    correctAnswer: "<script>",
    selectedAnswer: "<javascript>"
  },
];

const Studentresult = () => {
  const [VivaResult, SetVivaResult] = useState([])

    useEffect(() => {
            try {
                const result=JSON.parse(localStorage.getItem('vivaresult'))
                SetVivaResult(result)
         
              
                
            } catch (error) {
                
            }
    }, [])
    
  return (
 <div className="quiz-container">
      {VivaResult.map((q, index) => (
        <div key={index} className="question-block">
          <h4>{index + 1}. {q.question}</h4>
          <div className="options">
            {Object.entries(q.options).map(([key, value]) => {
              let className = "option";

              if (q.selectedAnswer === key) {
                className += key === q.correctAnswer ? " correct" : " wrong";
              } else if (key === q.correctAnswer && q.selectedAnswer !== q.correctAnswer) {
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
