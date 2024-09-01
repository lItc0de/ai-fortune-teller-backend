import fs from "fs";
import OpenAI from "openai";

class TTS {
  openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  create = async (text?: string): Promise<string> => {
    const audioPath = `tts_audios/audio.mp3`;
    if (!text) return "";

    const mp3 = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
      speed: 1.2,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(audioPath, buffer);
    return audioPath;
  };
}

export default TTS;
