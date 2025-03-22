"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTutorSessionStore } from "@/stores/tutorSessionStore";
import getInitialIncorrectReasoning from "@/app/actions/getInitialIncorrectReasoning";

export default function ChartDisplay() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { currentPage, updateCurrentPage } = useTutorSessionStore();
  const page = currentPage();

  // Redirect to home if page object is null
  useEffect(() => {
    if (!page) {
      router.push("/");
    }
  }, [page, router]);

  // Call AI to get incorrect reasoning when component mounts
  useEffect(() => {
    async function getAIReasoning() {
      if (
        page &&
        page.imageSrc &&
        page.misleadingFeature &&
        !page.firstIncorrectReasoning
      ) {
        setLoading(true);
        try {
          const reasoning = await getInitialIncorrectReasoning(
            page.imageSrc,
            page.misleadingFeature
          );
          updateCurrentPage({ firstIncorrectReasoning: reasoning });
        } catch (error) {
          console.error("Failed to get AI reasoning:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    getAIReasoning();
  }, [page, updateCurrentPage]);

  return page ? (
    <>
      <img src={page.imageSrc} title={page.imageTitle} alt="Chart 1" />

      <p className="font-bold mt-4 py-2 border-b-1">
        AI's First (Incorrect) Reasoning
      </p>

      {loading ? (
        <p className="mt-2">Loading AI reasoning...</p>
      ) : (
        <p className="mt-2">{page.firstIncorrectReasoning}</p>
      )}
    </>
  ) : (
    <div>Invalid Page</div>
  );
}
