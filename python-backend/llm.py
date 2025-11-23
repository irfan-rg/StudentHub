import requests, json, jwt, time, re
from flask import request, jsonify

OLLAMA_API = "http://localhost:11434/api/generate"
SECRET_KEY = "supersecretkey"

def extract_keywords(text):
    tech_terms = [
        "python", "java", "c++", "javascript", "constructor",
        "class", "object", "inheritance", "oop", "api",
        "function", "method", "variable", "loop", "data structure",
        "algorithm", "recursion", "stack", "queue", "linked list",
        "hashmap", "dictionary", "set", "array", "pointer",
        "encapsulation", "polymorphism", "abstraction", "exception",
        "thread", "process", "database", "sql", "nosql",
        "json", "xml", "rest", "graphql", "framework",
        "library", "module", "package", "compiler", "interpreter",
        "syntax", "runtime", "debugging", "testing", "unit test",
        "integration test", "version control", "git", "github",
        "deployment", "cloud", "docker", "kubernetes", "microservices"
    ]
    words = re.findall(r"\b\w+\b", text.lower())
    keywords = [w for w in words if w in tech_terms]
    return keywords or ["general"]

def ask_model():
    data = request.get_json()

    prompt = data.get("prompt", "Hello AI!")
    user_profile = data.get("user", {})
    token = data.get("token", None)

    if not token:
        keywords = extract_keywords(prompt)
        payload_token = {
            "keywords": keywords,
            "timestamp": int(time.time()),
            "exp": int(time.time()) + 30000
        }
        token = jwt.encode(payload_token, SECRET_KEY, algorithm="HS256")
        if isinstance(token, bytes):
            token = token.decode("utf-8")

    else:
        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            keywords = decoded.get("keywords", [])
            keywords_new = extract_keywords(prompt)
            payload_token = {
                "keywords": keywords_new,
                "timestamp": int(time.time()),
                "exp": int(time.time()) + 30000
            }
            token = jwt.encode(payload_token, SECRET_KEY, algorithm="HS256")
            if isinstance(token, bytes):
                token = token.decode("utf-8")
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired. Please regenerate."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

    final_prompt = f"""{user_profile}
    User asks: {prompt}
    Relevant context keywords: {', '.join(keywords)}
    Respond in a helpful and friendly way.
    """
    payload = {
        "model": "studentshub",
        "prompt": final_prompt
    }

    response = requests.post(OLLAMA_API, json=payload, stream=True)

    full_response = ""
    for line in response.iter_lines():
        if line:
            part = json.loads(line.decode("utf-8"))
            if "response" in part:
                full_response += part["response"]
            elif "error" in part:
                return jsonify({"error": part["error"]}), 500

    return jsonify({
        "prompt": prompt,
        "answer": full_response,
        "token": token
    })