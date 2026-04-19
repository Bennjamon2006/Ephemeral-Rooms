import { MessageRouter } from "application/messaging";
import { createContext } from "react";

interface MessagingContextValue {
  router: MessageRouter<"client"> | null;
}

export const MessagingContext = createContext<MessagingContextValue>({
  router: null,
});
