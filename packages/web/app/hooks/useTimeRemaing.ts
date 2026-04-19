import { useState, useEffect, useRef } from "react";

export default function useTimeRemaining(expiresAt: number, active = true) {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    Math.max(0, expiresAt - Date.now()),
  );

  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const tick = () => {
    const t = Math.max(0, expiresAt - Date.now());
    setTimeRemaining(t);

    if (t === 0) {
      clearTimers();
    }
  };

  useEffect(() => {
    if (!active) {
      clearTimers();
      return;
    }

    clearTimers();

    tick(); // inmediato

    const delay = 1000 - (Date.now() % 1000);

    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(tick, 1000);
    }, delay);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt, active]);

  return timeRemaining;
}

/*
Lifecycle:
- Mount -> tick inmediatamente para actualizar el tiempo restante, luego configurar el intervalo para que se ejecute cada segundo alineado al inicio del siguiente segundo.
- Actualización de expiresAt -> limpiar el intervalo existente, ejecutar tick inmediatamente para actualizar el tiempo restante, y configurar un nuevo intervalo alineado al siguiente segundo.
- Si el tiempo restante llega a 0, se limpia el intervalo para evitar actualizaciones innecesarias.
*/
