import ServerMessage, {
  Role,
  ServerMessageParams,
  Topic,
} from "./serverMessage";
import UserManager from "./userManager";
import e from "./dbschema/edgeql-js";

const URL = process.env.OPENAI_BASE_URL || "";

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

    console.log(prompt);

    // return "Hello back";

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    if (!res || !res.body) return "";

    const answer = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    if (!answer) return "";
    const content = answer.choices[0].message.content;

    await this.userManager.addMessageToHistory(
      message.userId,
      new ServerMessage({
        content,
        role: Role.assistant,
        topic: message.topic,
        userId: message.userId,
      })
    );

    return content;
  }

  private async getMessagesHistory(userId: string): Promise<ServerMessage[]> {
    console.log("run query");

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
    console.log("User", user);
    if (!user) return [];

    const systemMessages = [
      new ServerMessage({
        userId,
        role: Role.user,
        topic: Topic.GENERAL,
        content: `My name is ${user.name}.`,
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
