import { useState, useEffect } from "react";

const generateName = () => {
  const number = Math.floor(Math.random() * 10000);

  return `user_${number}`;
};

export default function useName() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (storedName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(storedName);
    } else {
      const newName = generateName();
      setName(newName);
    }
  }, []);

  const updateName = (newName: string) => {
    setName(newName);
    localStorage.setItem("name", newName);
  };

  return { name, updateName };
}
