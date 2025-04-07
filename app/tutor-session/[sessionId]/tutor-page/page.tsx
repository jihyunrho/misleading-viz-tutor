"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RedirectToFirstTutorPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const sessionId = params.sessionId;
    if (sessionId) {
      router.replace(`/tutor-session/${sessionId}/tutor-page/1`);
    }
  }, [params, router]);

  return (
    <div className="flex justify-center items-center h-screen text-gray-500">
      Redirecting to first tutor page...
    </div>
  );
}
