"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/util/db";
import { MockInterview } from "@/util/schema";
import { Lightbulb } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { eq } from "drizzle-orm";
import { WebcamIcon } from "lucide-react";
import Link from "next/link";
export default function Interview({ params }) {
  //params to get id from the dynamic route
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
    console.log("ID ai idhar " + params.interviewId);
  };

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col justify-center">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              style={{
                paddingTop: 20,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-6 p-20 bg-secondary rounded-lg border" />

              <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam and microphone
              </Button>
            </>
          )}
        </div>
        <div className="flex flex-col my-5 gap-5 ">
          <div className="p-5 rounded-lg border">
            <h2 className="text-lg ">
              <strong>Job Role: </strong>
              {interviewData ? interviewData.jobPosition : "Loading"}
            </h2>
            <h2 className="text-lg ">
              <strong>Job Description: </strong>
              {interviewData ? interviewData.jobDesc : "Loading"}
            </h2>
            <h2 className="text-lg ">
              <strong>Job Experience: </strong>
              {interviewData ? interviewData.jobExperience : "Loading"}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2>
              Enabling your webcam allows applications to access it, which may
              include recording and streaming. Ensure you trust the requesting
              application.
            </h2>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}
