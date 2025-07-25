import MessagesPage from "@/pages/MessagesPage";
import { Suspense } from "react";

export default function Messages() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <MessagesPage />
      </Suspense>
    </main>
  );
}
