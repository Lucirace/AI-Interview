"use client";
import React from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/util/geminiAIModel";
import { UserAnswer } from "@/util/schema";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { db } from "@/util/db";
import { StopCircle } from "lucide-react";
export default function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true, //false
    useLegacyResults: false,
  });
  useEffect(() => {
    results?.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);
  useEffect(() => {
    if (!isRecording && userAnswer != undefined && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        toast("Error while saving answer, please record again");
        return;
      }
    } else {
      startSpeechToText();
    }
  };
  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ", User Answer:" +
      userAnswer +
      ",Depends on question and user answer for given interview question" +
      "please give us rating for answer and feedabck as are a of improvement if any" +
      "in 3-5 lines to improve it in JSON format with raing field and feedback field";
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    // console.log( mockJsonResp);
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    // console.log(interviewData);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer.replace("undefined", ""),
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });
    if (resp) {
      toast("User Answer recorded sucessfully");
      setUserAnswer("");
      setResults([]);
    }
    setResults([]);

    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5 ">
        <Image
          src={"/webcam-svgrepo-com.svg"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 400,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
}
