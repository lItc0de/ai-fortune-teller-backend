import {
  type LlamaModel,
  LlamaChatSession,
  type LlamaContext,
} from "node-llama-cpp";
import { createContext, createModel, createSession } from "./llama";
import { systemPrompt } from "./prompts";

class Bot {
  model: LlamaModel;
  context: LlamaContext;
  currentSession?: LlamaChatSession;

  constructor() {
    this.model = createModel();
    this.context = createContext(this.model);
    this.init();
  }

  async init() {
    if (!this.currentSession) {
      this.currentSession = new LlamaChatSession({
        context: this.context,
        systemPrompt,
      });
      await this.currentSession.init();
    }
  }

  async newSession() {
    console.log("New session");
    return await this.currentSession?.prompt(
      `I am a new user you don't know me yet, but I'm kenn to learn about my future.`
    );
  }

  async restartOldChat(userName: string) {
    console.log("Old Chat:", userName);
    return await this.currentSession?.prompt(
      `
      My name is ${userName}. I am a new user. We have been chatting before and I was gone for a little.
      `
    );
  }

  async prompt(prompt: string) {
    console.log("Prompt:", prompt);
    return await this.currentSession?.prompt(prompt);
  }

  async tellUserName(userName: string) {
    console.log("Username:", userName);

    return await this.currentSession?.prompt(
      `My name is ${userName}. Please refer to me by this name in the future.`
    );
  }
}

export default Bot;
