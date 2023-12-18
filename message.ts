export enum MessageType {
  BOT,
  PROMPT,
  NEW_SESSION,
  OLD_SESSION,
  USERNAME,
}

export interface RawMessage {
  type: MessageType;
  prompt?: string;
  userName?: string;
}

class Message {
  type: MessageType;
  prompt?: string;
  userName?: string;

  constructor(type: MessageType, prompt?: string, userName?: string) {
    this.type = type;
    this.prompt = prompt;
    this.userName = userName;
  }

  toJSON(): string {
    const rawMessage: RawMessage = {
      type: this.type,
      prompt: this.prompt,
      userName: this.userName,
    };
    return JSON.stringify(rawMessage);
  }

  static createfromJSON(json: string) {
    const { type, prompt, userName } = JSON.parse(json) as RawMessage;
    return new Message(type, prompt, userName);
  }
}

export default Message;
