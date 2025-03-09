"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/util/db";
import { MockInterview } from "@/util/schema";
import { eq } from "drizzle-orm";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]); // Ensure it's an array
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length === 0) {
        console.error("No interview data found.");
        return;
      }

      const parsedMockResp = JSON.parse(result[0]?.jsonMockResp || "[]"); // Parse safely

      if (!Array.isArray(parsedMockResp)) {
        console.error("Invalid mock interview data format:", parsedMockResp);
        return;
      }

      console.log("Parsed Mock Response:", parsedMockResp);

      setMockInterviewQuestion(parsedMockResp.map((q) => q.text || "")); // Extract text from objects
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}

        {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestion.length - 1 && interviewData && (
          <Link href={`/dashboard/interview/${interviewData.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
