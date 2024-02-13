import Message from "./serverMessage";

class Prompt {
  message: Message;

  constructor(message: Message) {
    this.message = message;
  }
}

export default Prompt;
