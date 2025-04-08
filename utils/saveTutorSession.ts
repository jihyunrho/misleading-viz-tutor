import { useTutorSessionStore } from "@/stores/tutorSessionStore";

let timeout: NodeJS.Timeout;

export function saveTutorSession(debounce = true) {
  const state = useTutorSessionStore.getState();

  const payload = {
    currentPageIndex: state.currentPageIndex,
    messages: state.messages ?? [],
  };

  const doSave = () => {
    fetch(`/api/session/${state.sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  if (debounce) {
    clearTimeout(timeout);
    timeout = setTimeout(doSave, 500); // debounce for performance
  } else {
    doSave();
  }
}
