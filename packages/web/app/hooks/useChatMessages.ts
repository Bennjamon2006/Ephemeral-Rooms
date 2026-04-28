import { useEffect, useState } from "react";
import type { Message } from "shared/models";
import useDispatch from "./useDispatch";
import useMessage from "./useMessage";
import { messages } from "shared/messaging";

export default function useChatMessages(initialMessages: Message[]) {
  const [chatMessages, setMessages] = useState<Message[]>(initialMessages);
  const dispatch = useDispatch();

  useMessage("syncMessagesResult", (message) => {
    setMessages(message.payload.messages);
  });

  useMessage("newMessage", (message) => {
    setMessages((prevMessages) => {
      console.log("Received new message:", message.payload.message);
      if (prevMessages.some((m) => m.id === message.payload.message.id)) {
        return prevMessages;
      }
      return [...prevMessages, message.payload.message];
    });
  });

  useEffect(() => {
    dispatch(new messages.commands.syncMessages());
  }, [dispatch]);

  return chatMessages;
}
