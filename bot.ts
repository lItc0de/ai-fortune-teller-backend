// import OpenAI from "openai";

// this.chatPromptOptions = {
//   repeatPenalty: { penalty: 1.1, lastTokens: 128 },
//   temperature: 1,
//   topK: 35,
//   topP: 0.5,
// };

const URL = process.env.OPENAI_BASE_URL || "";

class Bot {
  // openai: OpenAI;

  constructor() {
    // this.openai = new OpenAI({
    //   baseURL: process.env.OPENAI_BASE_URL,
    // });
    // this.openai = new OpenAI();
  }

  async newSession() {
    console.log("New session");
    // return await this.currentSession?.prompt(
    //   `I am a new user you don't know me yet, but I'm kenn to learn about my future.`
    // );
  }

  async restartOldChat(userName: string) {
    console.log("Old Chat:", userName);
    // return await this.currentSession?.prompt(
    //   `
    //   My name is ${userName}. I am a new user. We have been chatting before and I was gone for a little.
    //   `
    // );
  }

  async prompt(prompt: string): Promise<string> {
    const message = {
      mode: "chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    console.log("Prompt:", prompt);
    console.log("answer:", res);
    if (!res || !res.body) return "";

    const answer = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    if (!answer) return "";
    return answer.choices[0].message.content;
  }

  async tellUserName(userName: string) {
    console.log("Username:", userName);

    // return await this.currentSession?.prompt(
    //   `My name is ${userName}. Please refer to me by this name in the future.`
    // );
  }
}

export default Bot;
