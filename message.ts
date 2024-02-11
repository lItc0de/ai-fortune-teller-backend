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

export type Prompt = {};

class Message {
  type: MessageType;
  prompt?: string;
  userName?: string;

  constructor(type: MessageType, prompt?: string, userName?: string) {
    this.type = type;
    this.prompt = prompt;
    this.userName = userName;
  }

  toJSONString(): string {
    const rawMessage: RawMessage = {
      type: this.type,
      prompt: this.prompt,
      userName: this.userName,
    };
    return JSON.stringify(rawMessage);
  }

  static createfromJSON(rawMessage: RawMessage) {
    const { type, prompt, userName } = rawMessage;
    return new Message(type, prompt, userName);
  }

  toPrompt(): Prompt {
    return {};
  }
}

export default Message;
