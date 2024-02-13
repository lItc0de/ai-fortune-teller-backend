import e from "./dbschema/edgeql-js";

export type TopicType = "LOVE" | "CAREER" | "GENERAL" | "QUESTION";

export enum Topic {
  LOVE,
  CAREER,
  GENERAL,
  QUESTION,
}

export type RoleType = "user" | "system" | "assistant";

export enum Role {
  user,
  system,
  assistant,
}

export type ServerMessageParams = Omit<
  ServerMessage,
  "toJSONString" | "toPrompt" | "toMessage" | "toDBMessage"
>;

class ServerMessage {
  userId: string;
  role: Role;
  content: string;
  topic: Topic;

  constructor(params: ServerMessageParams) {
    this.userId = params.userId;
    this.role = params.role;
    this.content = params.content;
    this.topic = params.topic;
  }

  toJSONString(): string {
    return JSON.stringify({
      userId: this.userId,
      role: this.role,
      content: this.content,
      topic: this.topic,
    });
  }

  toDBMessage() {
    const role = Role[this.role] as RoleType;
    const topic = Topic[this.topic] as TopicType;
    return {
      role: e.Role[role],
      createdAt: e.datetime(new Date().toISOString()),
      topic: e.Topic[topic],
      content: this.content,
    };
  }

  toMessage() {
    return { role: Role[this.role], content: this.content };
  }

  toPrompt(messagesHistory: ServerMessage[]) {
    const oldMessages = messagesHistory.map((serverMessage) =>
      serverMessage.toMessage()
    );
    return {
      mode: "chat",
      messages: [...oldMessages, this.toMessage()],
      character: Topic[this.topic],
    };
  }
}

export default ServerMessage;
