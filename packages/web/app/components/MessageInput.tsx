import { useState } from "react";
import CustomButton from "./Button";

type Props = {
  onSend: (message: string) => void;
};

export default function MessageInput({ onSend }: Props) {
  const [message, setMessage] = useState("");
  const disabled = message.trim() === "";

  const handleSend = () => {
    if (disabled) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="border-t border-gray-800 p-4">
      <div className="flex items-center bg-gray-900 border border-gray-800 rounded px-2">
        <input
          className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <CustomButton
          fullSized={false}
          onClick={handleSend}
          disabled={disabled}
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
              clip-rule="evenodd"
            />
          </svg>
        </CustomButton>
      </div>
    </div>
  );
}
