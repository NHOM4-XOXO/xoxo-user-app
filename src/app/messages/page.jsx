import CleanMessagesPage from "@/pages/MessagesPage/CleanMessagesPage";
import { Suspense } from "react";

export default function Messages() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <CleanMessagesPage />
      </Suspense>
    </main>
  );
}
