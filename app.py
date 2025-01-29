from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from chatbot import chatbot

# Initialize Flask App
app = Flask(__name__)
CORS(app)

@app.route('/chatbot', methods=['POST'])
def handle_prompt():
    data = request.get_json()
    input_text = data.get('prompt', '')
    response = chatbot.generate_response(input_text)
    return response

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
