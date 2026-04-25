export default abstract class Envelope<T extends string, P> {
  public static isMessage(obj: any): obj is Envelope<string, any> {
    return obj instanceof Envelope;
  }

  constructor(
    public readonly type: T,
    public readonly payload: P,
    public readonly timestamp: number = Date.now(),
    public readonly senderId?: string,
  ) {
    if (!this.validate()) {
      throw new Error(`Invalid message of type ${type}`);
    }
  }

  public toJSON() {
    return {
      type: this.type,
      payload: this.payload,
      timestamp: this.timestamp,
      senderId: this.senderId,
    };
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  abstract validate(): boolean;
}

export type MessageHandler<T extends Envelope<string, any>> = (
  message: T,
) => void;
