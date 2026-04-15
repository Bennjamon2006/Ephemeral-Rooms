export default interface MessageTransporter {
  prepare: () => Promise<void>;
  onMessage: (handler: (raw: string) => void) => void;
  sendMessage: (raw: string) => void;
}
