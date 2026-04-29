"use client";

import { useEffect, useState } from "react";

import { MessageRouter } from "application/messaging";
import { WSClientMessageTransporter } from "infra/ws";
import { MessagingContext } from "./MessagingContext";

type Props = {
  children: React.ReactNode;
  url: string;
};

export default function MessagingProvider({ children, url }: Props) {
  const [router, setRouter] = useState<MessageRouter<"client"> | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const transporter = new WSClientMessageTransporter(url);
    const messageRouter = new MessageRouter(transporter, "client");

    setConnected(false);

    messageRouter
      .start()
      .then(() => {
        setRouter(messageRouter);
        setConnected(true);
      })
      .catch((error) => {
        console.error("Failed to start MessageRouter:", error);
      });

    return () => {
      messageRouter.stop();
    };
  }, [url]);

  return (
    <MessagingContext.Provider value={{ router, connected }}>
      {children}
    </MessagingContext.Provider>
  );
}
