import ServerMessage, {
  Role,
  ServerMessageParams,
  Topic,
} from "./serverMessage";
import UserManager from "./userManager";
import e from "./dbschema/edgeql-js";
import ClaudeBot from "./claude";

const URL = process.env.OPENAI_BASE_URL || "";
const claudeBot = new ClaudeBot();

class ChatManager {
  private userManager: UserManager;

  constructor(userManager: UserManager) {
    this.userManager = userManager;
  }

  async handleMessage(
    serverMessageParams: ServerMessageParams
  ): Promise<string | undefined> {
    const message = new ServerMessage(serverMessageParams);

    if (message.role === Role.assistant) return;
    const userId = await this.userManager.getOrCreateUser(
      message.userId,
      message.userName
    );

    if (!userId) return;

    const messagesHistory = await this.getMessagesHistory(message.userId);

    await this.userManager.addMessageToHistory(
      message.userId,
      new ServerMessage({
        content: message.content,
        role: Role.user,
        topic: message.topic,
        userId: message.userId,
      })
    );

    const prompt = message.toPrompt(messagesHistory);

    const answer = await claudeBot.chat(
      prompt.messages,
      message.userId,
      message.topic
    );

    if (!answer) return "";
    const content = answer.content[0];
    if (content.type !== "text") return;

    const text = content.text;

    await this.userManager.addMessageToHistory(
      message.userId,
      new ServerMessage({
        content: text,
        role: Role.assistant,
        topic: message.topic,
        userId: message.userId,
      })
    );

    return text;
  }

  async handleProfile(
    serverMessageParams: ServerMessageParams
  ): Promise<string | undefined> {
    const message = new ServerMessage(serverMessageParams);
    const prompt = message.toPrompt([]);
    let text = "You are an interesting person.";

    const answer = await claudeBot.chat(
      prompt.messages,
      message.userId,
      message.topic
    );

    if (!answer) return "";
    const content = answer.content[0];
    if (content.type === "text") text = content.text;

    return text;
  }

  private async getMessagesHistory(userId: string): Promise<ServerMessage[]> {
    const query = e.select(e.User, () => ({
      filter_single: { id: userId },
      name: true,
      characterTraits: true,
      messages: (message) => ({
        role: true,
        content: true,
        topic: true,
        order_by: message.createdAt,
      }),
    }));

    const user = await query.run(this.userManager.client);
    if (!user) return [];

    const systemMessages = [
      new ServerMessage({
        userId,
        role: Role.user,
        topic: Topic.GENERAL,
        content: `My name is ${user.name}.`,
      }),
      new ServerMessage({
        userId,
        role: Role.assistant,
        topic: Topic.GENERAL,
        content: `Hello ${user.name}.`,
      }),
    ];

    if (user.characterTraits.length !== 0) {
      systemMessages.push(
        new ServerMessage({
          userId,
          role: Role.user,
          topic: Topic.GENERAL,
          content: `I have the following character traits: ${user.characterTraits.join(
            ", "
          )}. Use them to give me more precise answers.`,
        })
      );

      systemMessages.push(
        new ServerMessage({
          userId,
          role: Role.assistant,
          topic: Topic.GENERAL,
          content: `I will do.`,
        })
      );
    }

    const oldMessages = user.messages.map(
      (message) =>
        new ServerMessage({
          userId,
          role: Role[message.role],
          topic: Topic[message.topic],
          content: message.content,
        })
    );

    return [...systemMessages, ...oldMessages];
  }
}

export default ChatManager;
