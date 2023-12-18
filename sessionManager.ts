import { type ServerWebSocket } from "bun";
import Message, { MessageType } from "./message";
import Bot from "./bot";

class SessionManager {
  private bot: Bot;

  constructor() {
    this.bot = new Bot();
  }

  async handleMessage(ws: ServerWebSocket<{}>, messageJSON: string) {
    const message = Message.createfromJSON(messageJSON);
    console.log(message);

    switch (message.type) {
      case MessageType.NEW_SESSION:
        await this.bot.newSession();
        break;

      case MessageType.OLD_SESSION:
        await this.bot.newSession();
        if (message.userName) await this.bot.restartOldChat(message.userName);
        break;

      case MessageType.PROMPT:
        if (!message.prompt) break;

        const answer = await this.bot.prompt(message.prompt);
        if (answer) {
          const newMessage = new Message(MessageType.BOT, answer);
          ws.send(newMessage.toJSON());
        }
        break;

      case MessageType.USERNAME:
        if (!message.userName) break;

        await this.bot.tellUserName(message.userName);
        break;
    }
  }
}

export default SessionManager;
