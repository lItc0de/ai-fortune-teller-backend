# V4
import os
import sys
import torch

text = sys.argv[1]
audio_path = sys.argv[2]
speaker = sys.argv[3]

# if not text:
#     text = 'Hello, I am an example'
# if not audio_path:
#     audio_path = 'tts_audios/hello.wav'
# if not speaker:
#     speaker = 'en_0'

device = torch.device('cpu')
torch.set_num_threads(4)
LOCAL_FILE = 'models/tts.pt'

if not os.path.isfile(LOCAL_FILE):
    torch.hub.download_url_to_file('https://models.silero.ai/models/tts/en/v3_en.pt',
                                   LOCAL_FILE)

model = torch.package.PackageImporter(LOCAL_FILE).load_pickle("tts_models", "model")
model.to(device)

SAMPLE_RATE = 48000

model.save_wav(text=text, speaker=speaker, sample_rate=SAMPLE_RATE, audio_path=audio_path)
