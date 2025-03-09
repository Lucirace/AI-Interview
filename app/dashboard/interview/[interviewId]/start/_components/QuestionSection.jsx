import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

export default function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Not supported by browser");
    }
  };

  // Extract questions array
  const questionsArray = mockInterviewQuestion?.questions || [];

  // Check if questions are available
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    return <h2>No questions available</h2>;
  }

  const currentQuestion = questionsArray[activeQuestionIndex]?.question;

  // Handle cases where `question` is an object instead of a string
  const displayQuestion =
    typeof currentQuestion === "string"
      ? currentQuestion
      : currentQuestion?.text || "No question available";

  return (
    <div className="p-5 border rounded-lg my-10">
      {/* Question Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questionsArray.map((item, index) => (
          <h2
            key={index} // ✅ Added key prop
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestionIndex === index ? "bg-violet-500 text-white" : ""
            }`}
          >
            Question {index + 1}
          </h2>
        ))}
      </div>

      {/* Active Question Display */}
      <h2 className="my-5 text-md md:text-lg">{displayQuestion}</h2>

      {/* Text-to-Speech Button */}
      <Volume2 className="cursor-pointer" onClick={() => textToSpeech(displayQuestion)} />

      {/* Instructions */}
      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-black">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          Click on "Record Answer" when you want to answer the question. At the
          end of the interview, we will give you feedback along with the correct
          answer for each question and your response for comparison.
        </h2>
      </div>
    </div>
  );
}
