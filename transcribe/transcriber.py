import torch
from transformers import pipeline

class Transcriber:
    def __init__(self, model_name="openai/whisper-base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = pipeline("automatic-speech-recognition", model=model_name, device=self.device)

    def transcribe_audio(self, audio_file):
        """Transcribes an audio file using Whisper."""
        try:
            result = self.model(audio_file)
            return result["text"]
        except Exception as e:
            return f"Error: {str(e)}"

transcriber = Transcriber()
