import { useContext, useCallback, useRef } from "react";
import { MessagingContext } from "../contexts/messaging/MessagingContext";
import { ClientMessages } from "application/messaging";

type ClientMessage = InstanceType<ClientMessages[keyof ClientMessages]>;

type Dispatch = (message: ClientMessage) => void;

export default function useDispatch(): Dispatch {
  const context = useContext(MessagingContext);
  const queueRef = useRef<ClientMessage[]>([]);

  if (!context) {
    throw new Error("useDispatch must be used within a MessagingProvider");
  }

  const { router, connected } = context;

  const dispatch: Dispatch = useCallback(
    (message) => {
      if (!connected) {
        queueRef.current.push(message);
        return;
      }

      router!.send(message);
    },
    [router, connected],
  );

  return dispatch;
}
