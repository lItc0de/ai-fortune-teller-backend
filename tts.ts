const PYTHON_PATH = "/Users/basti/miniforge3/envs/fortuneTeller/bin/python";
const SCRIPT_PATH = "./tts.py";

class TTS {
  create = async (text?: string): Promise<string> => {
    // const audioPath = `tts_audios/${Date.now()}.wav`;
    const audioPath = `tts_audios/audio.wav`;
    if (!text) return "";
    // await spawnSync(PYTHON_PATH, [SCRIPT_PATH, text, audioPath, "en_0"]);
    // const result = process.stdout?.toString();
    const proc = Bun.spawn(
      [PYTHON_PATH, SCRIPT_PATH, text, audioPath, "en_0"],
      {
        onExit(proc, exitCode, signalCode, error) {
          console.log({ proc, exitCode, signalCode, error });
        },
      }
    );

    await proc.exited;

    return audioPath;
  };
}

export default TTS;
