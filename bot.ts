const URL = process.env.OPENAI_BASE_URL || "";

class Bot {
  constructor() {}

  async prompt(prompt: string): Promise<string> {
    const message = {
      mode: "chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      character: "AI Fortune Teller",
    };

    console.log(message);

    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!res || !res.body) return "";

    const answer = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    if (!answer) return "";
    console.log("Answer:", answer);

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
