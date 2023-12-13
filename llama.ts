import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createModel = () => {
  return new LlamaModel({
    modelPath: path.join(
      __dirname,
      "models",
      "smol-7b.Q4_K_M",
      "smol-7b.Q4_K_M.gguf"
    ),
  });
};

export const createContext = (model: LlamaModel) => new LlamaContext({ model });
export const createSession = (context: LlamaContext) =>
  new LlamaChatSession({ context });

// const q1 = "Hi there, how are you?";
// console.log("User: " + q1);

// const a1 = await session.prompt(q1);
// console.log("AI: " + a1);

// const q2 = "Summerize what you said";
// console.log("User: " + q2);

// const a2 = await session.prompt(q2);
// console.log("AI: " + a2);
