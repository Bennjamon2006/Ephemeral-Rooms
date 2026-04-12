import { createContext } from "react";

interface WSContextValue {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  send: (event: string, data: unknown) => void;
  on: (event: string, handler: (data: unknown) => void) => void;
  off: (event: string, handler: (data: unknown) => void) => void;
  once: (event: string, handler: (data: unknown) => void) => void;
}

const WSContext = createContext<WSContextValue>({
  connected: false,
  connect: () => {},
  disconnect: () => {},
  send: () => {},
  on: () => {},
  off: () => {},
  once: () => {},
});

export default WSContext;
