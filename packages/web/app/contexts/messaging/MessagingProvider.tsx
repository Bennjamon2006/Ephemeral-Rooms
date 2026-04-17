"use client";

import { useMemo } from "react";

import { MessageRouter } from "application/messaging";
import { WSClientMessageTransporter } from "infra/messaging";
import messageMap from "./messages";
import { MessagingContext } from "./MessagingContext";

type Props = {
  children: React.ReactNode;
  url: string;
};

export default function MessagingProvider({ children, url }: Props) {
  const router = useMemo(() => {
    const ws = new WebSocket(url);

    const transporter = new WSClientMessageTransporter(ws);
    const router = new MessageRouter(transporter, messageMap);

    return router;
  }, [url]);

  return (
    <MessagingContext.Provider value={{ router }}>
      {children}
    </MessagingContext.Provider>
  );
}
