# Python AI/ML Backend for Student Hub

This is the Python Flask backend that provides AI and ML features for the Student Hub application.

## Features

1. **AI Chatbot** - Ollama-based conversational AI for student queries
2. **ML Recommendations** - K-means clustering for user matching
3. **PDF Question Generator** - Gemini AI for generating MCQs from PDFs

## Prerequisites

- Python 3.9+
- MongoDB running on `mongodb://localhost:27017/`
- Ollama installed with "studentshub" model
- Google Gemini API key

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Ollama model:
```bash
# Install Ollama from https://ollama.ai
# Create custom model using Modelfile
ollama create studentshub -f Modelfile
```

3. Update API keys in files:
   - `generate_qna.py`: Update `api_key` with your Google Gemini API key
   - `get_all_users.py`: Verify MongoDB URI and database name

## Running the Server

```bash
python app.py
```

Server runs on: `http://localhost:4444`

## API Endpoints

### 1. Ask Chatbot
**POST** `/ask-chatbot`

Request:
```json
{
  "prompt": "What is inheritance in Java?",
  "user": {
    "name": "John",
    "skills": ["JavaScript", "Python"]
  },
  "token": "optional_jwt_token"
}
```

Response:
```json
{
  "prompt": "What is inheritance in Java?",
  "answer": "Inheritance is a fundamental concept...",
  "token": "jwt_token_for_context"
}
```

### 2. Get Recommendations
**POST** `/get-recomendations`

Request:
```json
{
  "user": {
    "educationLevel": "Bachelor",
    "skillsCanTeach": ["Python", "JavaScript"],
    "badges": ["Helper", "Mentor"],
    "points": 150,
    "sessionsCompleted": 5,
    "questionsAnswered": 20,
    "rating": 4.5
  },
  "nums": 5
}
```

Response:
```json
{
  "result": [
    {"_id": "user_id_1", "similarity": 85.5},
    {"_id": "user_id_2", "similarity": 78.3}
  ]
}
```

### 3. Generate Questions from PDF
**POST** `/get_qna`

Request: multipart/form-data with file upload

Response:
```json
{
  "response": [
    {
      "question": "What is the main topic?",
      "options": ["A", "B", "C", "D"],
      "answer": "C"
    }
  ]
}
```

## Database Configuration

The `get_all_users.py` connects to MongoDB:
- **URI**: `mongodb://localhost:27017/`
- **Database**: `zStudentHub`
- **Collection**: `users`

Update these values in `get_all_users.py` if your configuration differs.

## Integration with Node Backend

The Node.js backend runs on port 3000, Python backend on port 4444.

Frontend should call:
- **Node backend (port 3000)**: Auth, users, sessions, skills, QnA, notifications
- **Python backend (port 4444)**: AI chatbot, recommendations, PDF processing

## Troubleshooting

### Ollama Connection Error
- Ensure Ollama is running: `ollama serve`
- Verify model exists: `ollama list`

### MongoDB Connection Error
- Check MongoDB is running
- Verify database name and collection name

### Gemini API Error
- Verify API key in `generate_qna.py`
- Check API quota limits

## Model Configuration

The `Modelfile` contains the Ollama model configuration for the studentshub chatbot. Customize it for your needs.
