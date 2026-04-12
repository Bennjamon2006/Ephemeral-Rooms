"use client";

import { useState, useRef } from "react";
import WSContext from "./WSContext";

interface WSProviderProps {
  children: React.ReactNode;
  url: string; // WebSocket server URL
}

export default function WSProvider({ children, url }: WSProviderProps) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Record<string, Set<(data: unknown) => void>>>({});

  const connect = () => {
    if (wsRef.current) return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);

        handlersRef.current[eventName]?.forEach((handler) => handler(data));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  const send = (event: string, data: unknown) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({ event, data }));
    }
  };

  const on = (event: string, handler: (data: unknown) => void) => {
    if (!handlersRef.current[event]) {
      handlersRef.current[event] = new Set();
    }
    handlersRef.current[event].add(handler);
  };

  const off = (event: string, handler: (data: unknown) => void) => {
    handlersRef.current[event]?.delete(handler);
  };

  const once = (event: string, handler: (data: unknown) => void) => {
    const wrapper = (data: unknown) => {
      handler(data);
      off(event, wrapper);
    };
    on(event, wrapper);
  };

  return (
    <WSContext.Provider
      value={{ connected, connect, disconnect, send, on, off, once }}
    >
      {children}
    </WSContext.Provider>
  );
}
