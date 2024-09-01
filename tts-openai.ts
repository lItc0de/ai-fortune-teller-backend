// import fs from "fs";
import OpenAI from "openai";

class TTS {
  openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  create = async (text?: string): Promise<Buffer | undefined> => {
    // const audioPath = `tts_audios/audio.mp3`;
    if (!text) return;

    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
      speed: 1.2,
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());
    // await fs.promises.writeFile(audioPath, buffer);
    return audioBuffer;
  };
}

export default TTS;
