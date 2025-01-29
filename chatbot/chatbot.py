from .model_loader import load_model

class Chatbot:
    def __init__(self, model_name="facebook/blenderbot-400M-distill"):
        self.model, self.tokenizer = load_model(model_name)
        self.conversation_history = []

    def generate_response(self, input_text):
        history = "\n".join(self.conversation_history[-10:])  # Keep only last 10 exchanges
        inputs = self.tokenizer.encode_plus(history, input_text, return_tensors="pt", truncation=True, max_length=512)
        outputs = self.model.generate(**inputs, max_length=60)
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

        self.conversation_history.append(input_text)
        self.conversation_history.append(response)

        return response
