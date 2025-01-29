from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from chatbot import chatbot
from transcribe import transcriber

# Initialize Flask App
app = Flask(__name__)
CORS(app)

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    data = request.get_json()
    input_text = data.get('prompt', '')
    response = chatbot.generate_response(input_text)
    return response

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files["audio"]
    response = transcriber.transcribe_audio(audio_file)
    return response

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
