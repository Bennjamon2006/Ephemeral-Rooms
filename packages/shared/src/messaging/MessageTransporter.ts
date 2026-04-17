export default interface MessageTransporter {
  prepare: () => Promise<void>;
  close: () => void;
  onMessage: (handler: (raw: string) => void) => void;
  sendMessage: (raw: string) => void;
}
