import { useContext, useRef, useEffect } from "react";
import { MessagingContext } from "../contexts/messaging/MessagingContext";
import { MessageTypes } from "../contexts/messaging/messages";

export default function useMessage<T extends keyof MessageTypes>(
  type: T,
  handler: (message: MessageTypes[T]) => void,
) {
  const { router } = useContext(MessagingContext);

  if (!router) {
    throw new Error("useMessage must be used within a MessagingProvider");
  }

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const messageHandler = (message: MessageTypes[T]) => {
      handlerRef.current(message);
    };

    router!.on(type, messageHandler);

    return () => {
      router!.off(type, messageHandler);
    };
  }, [router, type]);
}
