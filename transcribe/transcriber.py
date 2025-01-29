import torch
import numpy as np
import librosa
from transformers import pipeline

class Transcriber:
    def __init__(self, model_name="openai/whisper-base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = pipeline("automatic-speech-recognition", model=model_name, device=self.device)

    def transcribe_audio(self, audio_file):
        """Converts Flask FileStorage to raw audio and transcribes it."""
        try:
            # Read audio file into numpy array
            audio, sr = librosa.load(audio_file, sr=16000)  # Convert to 16kHz

            # Whisper expects an ndarray, so we ensure it's in the right format
            audio_np = np.array(audio, dtype=np.float32)

            result = self.model(audio_np)

            return result["text"]
        except Exception as e:
            return f"Error: {str(e)}"

transcriber = Transcriber()
