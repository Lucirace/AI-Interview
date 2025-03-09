import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function InterviewItemCard({ interview }) {
  const router = useRouter();
  const onStart = () => {
<<<<<<< HEAD
    router.push("/dashboard/interview/" + interview.mockId);
=======
    router.push("/dashboard/interview/" + interview?.mockId);
>>>>>>> 1e2b5253d00bf91dfe5abf10f504c6b230bc5263
  };
  const onFeedbackPress = () => {
    router.push("/dashboard/interview/" + interview.mockId + "/feedback");
  };
  return (
    <div className="border shadow-sm rounded-lg p-3 bg-slate-300">
      <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
      <h2 className="text-sm text-gray-700">
        {interview?.jobExperience + " year"}
      </h2>
      <h2 className="text-xs text-black-500">
        Created At:{interview?.createdAt}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button
          onClick={onFeedbackPress}
          size="sm"
          variant="outline"
          className="w-full"
        >
          Feedback
        </Button>

        <Button onClick={onStart} size="sm" className="w-full">
          Start
        </Button>
      </div>
    </div>
  );
}
