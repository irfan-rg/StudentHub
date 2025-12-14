from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from llm import ask_model
from ml import use_k_means_model
from flask import jsonify
from generate_qna import get_qna

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)

@app.route("/ask-chatbot", methods=["POST"])
def ask():
    return ask_model()

@app.route("/get-recomendations", methods=["POST"])
def get_recommendations():
    result = use_k_means_model()
    return jsonify({"result": result})

@app.route('/get_qna', methods=['POST'])
def getqna():
    return get_qna()

if __name__ == "__main__":
    app.run(port=4444, debug=True)