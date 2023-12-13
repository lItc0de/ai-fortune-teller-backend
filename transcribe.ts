import { CheetahWorker } from "@picovoice/cheetah-web";
import { WebVoiceProcessor } from "@picovoice/web-voice-processor";

let cheetah: CheetahWorker | null = null;
let fullTranscript = "";

function transcriptCallback(cheetahTranscript: any) {
  fullTranscript += cheetahTranscript.transcript;
  if (cheetahTranscript.isEndpoint) {
    fullTranscript += "\n";
  }
}

async function initCheetah() {
  cheetah = await CheetahWorker.create(
    process.env.ACCESS_KEY || "",
    transcriptCallback,
    {
      publicPath: process.env.MODEL_RELATIVE_PATH,
    }
  );
}

export async function startCheetah() {
  if (!cheetah) {
    await initCheetah();
  }

  if (cheetah) await WebVoiceProcessor.subscribe(cheetah);
}

export async function stopCheetah() {
  if (cheetah) await WebVoiceProcessor.unsubscribe(cheetah);
}

startCheetah();
