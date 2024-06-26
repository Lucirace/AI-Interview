"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/util/db";
import { UserAnswer } from "@/util/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    GetFeedback();
  }, []);
  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    console.log(result);
    setFeedbackList(result);
  };
  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500">Interview not taken</h2>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-green-500">Congratulations</h2>
          <h2 className="font-bold my-3 text-2xl">
            Here is your interview feedback
          </h2>
          {/*     <h2 className="text-primary text-lg my-3">
            Your overall interview rating : <strong>7/10</strong>
          </h2> */}
          <h2 className="text-xl my-3 ">
            Questions with correct answer, your response and feedback are given
            below
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-10">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                  {item.question}
                  <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating:</strong>
                      {item.rating}
                    </h2>
                    <h2 className="text-red-500 p-2 border rounded-lg bg-red-50">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="text-green-500 p-2 border rounded-lg bg-green-50">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="text-blue-500 p-2 border rounded-lg bg-blue-50">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Button
        className="my-5"
        onClick={() => {
          router.replace("/dashboard");
        }}
      >
        Go Home
      </Button>
    </div>
  );
}
