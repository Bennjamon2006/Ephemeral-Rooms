import { useContext, useCallback } from "react";
import { MessagingContext } from "../contexts/messaging/MessagingContext";
import { MessageTypes } from "../contexts/messaging/messages";

type Dispatch = (message: MessageTypes[keyof MessageTypes]) => void;

export default function useDispatch(): Dispatch {
  const { router } = useContext(MessagingContext);

  if (!router) {
    throw new Error("useDispatch must be used within a MessagingProvider");
  }

  const dispatch: Dispatch = useCallback(
    (message) => {
      router.send(message);
    },
    [router],
  );

  return dispatch;
}
