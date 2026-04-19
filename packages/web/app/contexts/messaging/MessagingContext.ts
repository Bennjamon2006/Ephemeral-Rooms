import { MessageRouter } from "application/messaging";
import { createContext } from "react";

interface MessagingContextValue {
  router: MessageRouter<"client"> | null;
  connected: boolean;
}

export const MessagingContext = createContext<MessagingContextValue | null>(
  null,
);
