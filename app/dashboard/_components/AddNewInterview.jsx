"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/util/geminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/util/db";

import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { MockInterview } from "@/util/schema";
import { useRouter } from "next/navigation";
export default function AddNewInterview() {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  //we require the below variable for storing the data in db we need to renderit also on screen
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const inputPrompt =
      "Job position:" +
      jobPosition +
      ", Job description:" +
      jobDesc +
      ", Years of experience:" +
      jobExperience +
      ". Based on above description give 5 hardcore technical theoritical questions for an interview with answers in JSON field.Both question and answers must be in JSON field.";
    const result = await chatSession.sendMessage(inputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    //  const MockJsonResp = JSON.parse(MockJsonResp);
    //  console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobDesc: jobDesc,
          jobPosition: jobPosition,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({
          mockId: MockInterview.mockId,
        });
      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDialogue(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error");
    }
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor pointer transition-all"
        onClick={() => setOpenDialogue(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialogue}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview?
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role,Job description and
                    years of experience
                  </h2>
                  <div className="mt-4">
                    <label>
                      Job Role/Job Position
                      <Input
                        onChange={(event) => {
                          setJobPosition(event.target.value);
                        }}
                        className="mt-2"
                        placeholder="Ex. Full Stack Developer"
                        required
                      ></Input>
                    </label>
                  </div>
                  <div className="my-3">
                    <label>
                      Job Description / Tech Stack
                      <Textarea
                        onChange={(e) => {
                          setJobDesc(e.target.value);
                        }}
                        className="mt-2"
                        placeholder="Ex. Full Stack Developer"
                        required
                      ></Textarea>
                    </label>
                  </div>
                  <div className="mt-4">
                    <label>
                      Years of experience
                      <Input
                        onChange={(e) => {
                          setJobExperience(e.target.value);
                        }}
                        className="mt-2"
                        placeholder="Ex.5"
                        type="number"
                        required
                      ></Input>
                    </label>
                  </div>
                </div>
                <div className="flex gap-5 justify-end pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenDialogue(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
