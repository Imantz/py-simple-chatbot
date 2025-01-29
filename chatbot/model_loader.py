from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

def load_model(model_name="facebook/blenderbot-400M-distill"):
    """
    Loads and returns the model and tokenizer.
    """
    print(f"Loading model: {model_name} ...")
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    print("Model loaded successfully.")
    return model, tokenizer
