import { MessageRouter } from "application/messaging";
import { MessageTypes } from "./messages";
import { createContext } from "react";

interface MessagingContextValue {
  router: MessageRouter<MessageTypes> | null;
}

export const MessagingContext = createContext<MessagingContextValue>({
  router: null,
});
