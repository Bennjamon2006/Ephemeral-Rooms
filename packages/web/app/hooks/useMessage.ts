import { useContext, useRef, useEffect } from "react";
import { MessagingContext } from "../contexts/messaging/MessagingContext";
import { ClientMessages } from "application/messaging";

type ResolveMessageType<T extends keyof ClientMessages> = InstanceType<
  ClientMessages[T]
>;

export default function useMessage<T extends keyof ClientMessages>(
  type: T,
  handler: (message: ResolveMessageType<T>) => void,
) {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error("useMessage must be used within a MessagingProvider");
  }

  const { router, connected } = context;

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!connected) return;

    const messageHandler = (message: ResolveMessageType<T>) => {
      handlerRef.current(message);
    };

    router!.on(type, messageHandler);

    return () => {
      router!.off(type, messageHandler);
    };
  }, [router, type, connected]);
}
