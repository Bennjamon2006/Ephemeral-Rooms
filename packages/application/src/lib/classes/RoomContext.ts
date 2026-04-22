import { MessageRouter } from "@/lib/messaging";
import { RoomState, User } from "shared/models";
import { messages, ResolveMessageType } from "shared/messaging";

type Payload<T extends keyof typeof messages.system> = ResolveMessageType<
  "system",
  T
>["payload"];

export default class RoomContext {
  constructor(private readonly systemMessageRouter: MessageRouter<"system">) {}

  private on<T extends keyof typeof messages.system>(
    messageType: T,
    callback: (payload: Payload<T>) => void,
  ): () => void {
    const currentHandler = (message: ResolveMessageType<"system", T>) => {
      callback(message.payload);
    };

    // El router ya maneja la centralización de los handlers en uno solo, así que aquí podemos simplemente agregar el handler sin preocuparnos por eliminarlo después o por que se agreguen múltiples handlers para el mismo mensaje.
    this.systemMessageRouter.on(messageType, currentHandler);

    return () => {
      this.systemMessageRouter.off(messageType, currentHandler);
    };
  }

  public onRoomStateChange(callback: (roomState: RoomState) => void) {
    return this.on("roomDataUpdate", ({ roomState }) => {
      callback(roomState);
    });
  }

  public sendRoomDataUpdate(roomState: RoomState) {
    this.systemMessageRouter.send(
      new messages.system.roomDataUpdate({ roomState }),
    );
  }

  public onUserCreated(callback: (payload: Payload<"userCreated">) => void) {
    return this.on("userCreated", callback);
  }

  public sendUserCreated(user: User) {
    this.systemMessageRouter.send(new messages.system.userCreated({ user }));
  }
}
