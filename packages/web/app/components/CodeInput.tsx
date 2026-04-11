import { useRef, useLayoutEffect } from "react";
import { TextInput } from "flowbite-react";

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  enter?: () => void;
}

export default function CodeInput({ value, onChange, enter }: CodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<number>(0);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let code = "";
    const input = e.target.value;
    let cursorPos = e.target.selectionStart || 0;

    for (let i = 0; i < input.length; i++) {
      const char = input[i].toUpperCase();
      if (/[A-Z0-9]/.test(char)) {
        code += char;
      } else if (i < cursorPos) {
        cursorPos--;
      }
    }

    cursorRef.current = cursorPos;

    if (code !== value) {
      onChange(code);
    } else if (code !== input) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart || 0;

      if (selectionStart !== cursorRef.current) {
        inputRef.current.setSelectionRange(
          cursorRef.current,
          cursorRef.current,
        );
      }
    }
  }, [value]);

  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChange={changeHandler}
      onKeyDown={(e) => {
        if (e.key === "Enter" && enter) {
          enter();
        }
      }}
      placeholder="Enter room code"
      className="text-center text-2xl tracking-widest uppercase"
    />
  );
}
