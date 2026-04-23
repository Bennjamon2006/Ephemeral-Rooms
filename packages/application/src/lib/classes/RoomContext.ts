import { MessageRouter, SystemMessages } from "@/lib/messaging";
import { RoomState, User } from "shared/models";
import { messages } from "shared/messaging";

type Payload<T extends keyof SystemMessages> = SystemMessages[T] extends new (
  ...args: any[]
) => {
  payload: infer P;
}
  ? P
  : never;

export default class RoomContext {
  constructor(private readonly systemMessageRouter: MessageRouter<"system">) {}

  private on<T extends keyof SystemMessages>(
    messageType: T,
    callback: (payload: Payload<T>) => void,
  ): () => void {
    const currentHandler = (message: InstanceType<SystemMessages[T]>) => {
      callback(message.payload as Payload<T>);
    };

    // El router ya maneja la centralización de los handlers en uno solo, así que aquí podemos simplemente agregar el handler sin preocuparnos por eliminarlo después o por que se agreguen múltiples handlers para el mismo mensaje.
    this.systemMessageRouter.on(messageType, currentHandler);

    return () => {
      this.systemMessageRouter.off(messageType, currentHandler);
    };
  }

  public onRoomStateChange(callback: (roomState: RoomState) => void) {
    return this.on("roomDataUpdated", ({ roomState }) => {
      callback(roomState);
    });
  }

  public sendRoomDataUpdate(roomState: RoomState) {
    this.systemMessageRouter.send(
      new messages.events.roomDataUpdated({ roomState }),
    );
  }

  public onUserCreated(callback: (payload: Payload<"userCreated">) => void) {
    return this.on("userCreated", callback);
  }

  public sendUserCreated(user: User) {
    this.systemMessageRouter.send(new messages.events.userCreated({ user }));
  }
}
