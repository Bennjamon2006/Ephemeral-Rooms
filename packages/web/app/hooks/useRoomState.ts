import { useEffect, useState } from "react";
import type { RoomState } from "shared/models";
import useMessage from "./useMessage";
import { messages } from "shared/messaging";
import useDispatch from "./useDispatch";

export default function useRoomState(
  roomCode: string,
  initialRoomState: RoomState,
): RoomState {
  const [roomState, setRoomState] = useState(initialRoomState);
  const dispatch = useDispatch();

  useMessage("roomUpdate", (message) => {
    setRoomState(message.payload.roomState);
  });

  useEffect(() => {
    dispatch(new messages.client.watchRoomData({ roomCode }));
  }, [dispatch, roomCode]);

  return roomState;
}
