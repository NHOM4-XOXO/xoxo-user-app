<<<<<<< HEAD
import CleanMessagesPage from "@/pages/MessagesPage/CleanMessagesPage";
=======
import MessagesPage from "@/pages/MessagesPage";
>>>>>>> e831905428471ab851098df54886f2b232d48738
import { Suspense } from "react";

export default function Messages() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
<<<<<<< HEAD
        <CleanMessagesPage />
=======
        <MessagesPage />
>>>>>>> e831905428471ab851098df54886f2b232d48738
      </Suspense>
    </main>
  );
}
