import Anthropic from "@anthropic-ai/sdk";
import { RoleType, Topic } from "./serverMessage";
import { generateSystemPrompt } from "./prompts";

const MODEL = "claude-3-5-sonnet-20240620";
const MAX_TOKENS = 1024;

export type Message = {
  role: RoleType;
  content: string;
};

const anthropic = new Anthropic({
  // apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

class ClaudeBot {
  async chat(
    messages: Message[],
    userId: string,
    topic: Topic
  ): Promise<Anthropic.Messages.Message> {
    const message: Anthropic.Messages.MessageCreateParamsNonStreaming = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages,
      metadata: { user_id: userId },
      system: generateSystemPrompt(topic),
    };

    console.log("Message:", message);

    const answer = await anthropic.messages.create(message);

    console.log("Answer", answer);

    return answer;
  }
}

export default ClaudeBot;
