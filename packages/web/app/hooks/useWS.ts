import { useContext } from "react";
import WSContext from "../contexts/ws/WSContext";

export default function useWS() {
  const context = useContext(WSContext);

  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }

  return context;
}
