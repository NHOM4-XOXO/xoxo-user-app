import EnhancedMessagesPage from "@/pages/MessagesPage/EnhancedMessagesPage";
import { Suspense } from "react";

export default function Messages() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EnhancedMessagesPage />
      </Suspense>
    </main>
  );
}
