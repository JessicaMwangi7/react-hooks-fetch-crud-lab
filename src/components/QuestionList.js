import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({ onDeleteQuestion }) {
  const [questions, setQuestions] = useState([]);

  // Fetch questions when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((questions) => {
        setQuestions(questions);
      });
  }, []);

  // Handle question deletion
  function handleDeleteClick(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the question from the state
          const updatedQuestions = questions.filter((q) => q.id !== id);
          setQuestions(updatedQuestions);

          // Notify parent component if necessary
          if (onDeleteQuestion) {
            onDeleteQuestion(id);
          }
        } else {
          console.error("Failed to delete question");
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  }

  // Handle answer update
  function handleAnswerChange(id, correctIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        const updatedQuestions = questions.map((q) => {
          return q.id === updatedQuestion.id ? updatedQuestion : q;
        });
        setQuestions(updatedQuestions);
      });
  }

  // Render list of QuestionItems
  const questionItems = questions.map((question) => (
    <QuestionItem
      key={question.id}
      question={question}
      onDeleteClick={handleDeleteClick}
      onAnswerChange={handleAnswerChange}
    />
  ));

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{questionItems}</ul>
    </section>
  );
}

export default QuestionList;
