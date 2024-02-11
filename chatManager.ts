import { type ServerWebSocket } from "bun";
import Message, { MessageType, RawMessage } from "./message";
import Bot from "./bot";

class ChatManager {
  private bot: Bot;

  constructor() {
    this.bot = new Bot();
  }

  async handleMessage(rawMessage: RawMessage): Promise<string | undefined> {
    const message = Message.createfromJSON(rawMessage);
    console.log(message);

    switch (message.type) {
      case MessageType.NEW_SESSION:
        await this.bot.newSession();
        break;

      case MessageType.OLD_SESSION:
        if (message.userName) await this.bot.restartOldChat(message.userName);
        break;

      case MessageType.PROMPT:
        if (!message.prompt) break;

        const answer = await this.bot.prompt(message.prompt);
        if (answer) {
          console.log("anser:", answer);
          const response = {
            answer,
          };

          // const newMessage = new Message(MessageType.BOT, answer);
          // console.log(newMessage);
          // return newMessage.toJSONString();
          return JSON.stringify(response);
        }
        break;

      case MessageType.USERNAME:
        if (!message.userName) break;

        await this.bot.tellUserName(message.userName);
        break;
    }
  }
}

export default ChatManager;
