import {
  type LlamaModel,
  type LlamaChatSession,
  type LlamaContext,
} from "node-llama-cpp";
import { createContext, createModel, createSession } from "./llama";

class Bot {
  model: LlamaModel;
  context: LlamaContext;
  session: LlamaChatSession;

  constructor() {
    this.model = createModel();
    this.context = createContext(this.model);
    this.session = createSession(this.context);
  }

  async chat(msg: string) {
    return await this.session.prompt(msg);
  }
}

export default Bot;
