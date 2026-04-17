import Message from "../Message";

export default class PingMessage extends Message<"ping", {}> {
  constructor(payload: {}, timestamp?: number, senderId?: string) {
    super("ping", payload, timestamp, senderId);
  }

  public validate(): boolean {
    return true;
  }
}
