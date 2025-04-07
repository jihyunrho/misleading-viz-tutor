import { redirect } from "next/navigation";

export default function RedirectToFirstTutorPage({
  params,
}: {
  params: { sessionId: string };
}) {
  redirect(`/tutor-session/${params.sessionId}/tutor-page/1`);
}
