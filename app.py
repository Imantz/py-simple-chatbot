import tempfile
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from chatbot import chatbot
from transcribe import transcriber

# Initialize Flask App
app = Flask(__name__)
CORS(app)

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    data = request.get_json(silent=True)  # Handle cases where request body is not JSON
    if not data or "prompt" not in data:
        return jsonify({"error": "No prompt provided"}), 400
    
    input_text = data.get('prompt', '').strip()
    if not input_text:
        return jsonify({"error": "Prompt cannot be empty"}), 400

    response = chatbot.generate_response(input_text)
    return jsonify({"response": response})

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]
    
    if audio_file.filename == "":
        return jsonify({"error": "Invalid file"}), 400

    try:
        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as temp_audio:
            audio_file.save(temp_audio.name)
            temp_audio.flush()

            transcription = transcriber.transcribe_audio(temp_audio.name)

        return jsonify({"transcription": transcription})
    
    except Exception as e:
        return jsonify({"error": f"Transcription failed: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
