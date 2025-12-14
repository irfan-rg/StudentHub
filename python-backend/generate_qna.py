from flask import request, jsonify
from google.api_core.exceptions import NotFound
import PyPDF2
import google.generativeai as genai
import io
import re
import json
import tempfile
import os

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")
genai.configure(api_key=GEMINI_API_KEY)

def get_qna():
    print("=== get_qna called ===")
    
    if 'file' not in request.files:
        print("Error: No file in request")
        return jsonify({"error": "Missing file"}), 400

    pdf_file = request.files['file']
    print(f"File received: {pdf_file.filename}")
    
    if pdf_file.filename == "":
        print("Error: Empty filename")
        return jsonify({"error": "No file selected"}), 400
    
    user_prompt = """Generate 5-6 multiple choice questions from this document. 
    Format your response as a JSON array with objects having these exact keys:
    - question: the question text
    - options: array of 4 answer options (short in length)
    - answer: the correct answer (must match one of the options exactly)
    
    Return ONLY the JSON array, no markdown formatting, no explanation text."""

    temp_file_path = None
    try:
        print("Creating temporary file...")
        # Save uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            pdf_file.save(temp_file.name)
            temp_file_path = temp_file.name
            print(f"Saved to: {temp_file_path}")

        print("Uploading to Gemini...")
        # Upload file to Gemini
        uploaded_file = genai.upload_file(temp_file_path)
        print(f"Uploaded file URI: {uploaded_file.uri}")
        
        # Wait for file to be processed
        import time
        print("Waiting for file to be processed...")
        while uploaded_file.state.name == "PROCESSING":
            time.sleep(2)
            uploaded_file = genai.get_file(uploaded_file.name)
        
        if uploaded_file.state.name == "FAILED":
            raise Exception("File processing failed")
        
        print(f"File processed successfully: {uploaded_file.state.name}")

        print("Generating content...")
        # Generate content using the model -  gemini2.5-flash instead
        # Choose a supported model name (prefer flash/pro versions available in this environment)
        models = genai.list_models()
        model_candidates = [
            'models/gemini-2.5-flash',
            'models/gemini-2.5-pro',
            'models/gemini-2.0-flash',
            'models/gemini-pro-latest',
            'models/gemini-flash-latest'
        ]
        chosen_model_name = None
        for candidate in model_candidates:
            if any(m.name == candidate for m in models):
                chosen_model_name = candidate
                break
        if not chosen_model_name:
            # Fallback to the first model from list
            chosen_model_name = models[0].name if models else 'models/gemini-2.5-flash'

        print(f"Using model: {chosen_model_name}")

        model = genai.GenerativeModel(chosen_model_name)
        try:
            response = model.generate_content([uploaded_file, user_prompt])
        except NotFound as nf:
            print("Model or method not found for chosen model, falling back to text-based generation.")
            # Fallback: extract text locally and run a text prompt
            pdf_text = ''
            with open(temp_file_path, 'rb') as fh:
                reader = PyPDF2.PdfReader(fh)
                for page in reader.pages:
                    pdf_text += page.extract_text() or '\n'

            # Truncate to a safe length to avoid prompt overflow
            pdf_text = pdf_text[:20000]

            text_prompt = f"{pdf_text}\n\n{user_prompt}"
            # Use the same model for text generation (if it supports text input)
            response = model.generate_content([text_prompt])
        
        print("Content generated, cleaning up...")
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        response_text = response.text.strip()
        print(f"Response text: {response_text[:200]}...")
        
        # Try to extract JSON from response
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            # Find the actual JSON content
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1]) if len(lines) > 2 else response_text
        
        # Remove any remaining backticks or json tags
        response_text = response_text.replace('```json', '').replace('```', '').strip()
        
        print("Parsing JSON...")
        # Parse the JSON
        result = json.loads(response_text)
        
        # Ensure it's an array
        if not isinstance(result, list):
            print("Error: Response is not an array")
            return jsonify({"error": "Invalid response format from AI"}), 500
        
        print(f"Success! Generated {len(result)} questions")
        return jsonify({
            "response": result
        }), 200

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        return jsonify({"error": "Failed to parse AI response", "details": str(e)}), 500
    except Exception as e:
        print(f"Exception: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        return jsonify({"error": "Internal error", "details": str(e)}), 500
    

def markdown_to_json(markdown_string):    
    content_structure = []
    
    sections = re.split(r'^(#+\s.*)$', markdown_string, flags=re.MULTILINE)
    
    current_section = None
    for part in sections:
        part = part.strip()
        if not part:
            continue
            
        if re.match(r'^(#+\s.*)$', part):
            heading_level = part.count('#')
            heading_text = part.lstrip('# ').strip()
            current_section = {
                "type": "heading",
                "level": heading_level,
                "text": heading_text,
                "content": []
            }
            content_structure.append(current_section)
        elif current_section:
            paragraphs = part.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    current_section["content"].append({
                        "type": "paragraph",
                        "text": para.strip()
                    })
        else:
            paragraphs = part.split('\n\n')
            for para in paragraphs:
                if para.strip():
                    content_structure.append({
                        "type": "paragraph",
                        "text": para.strip()
                    })

    return json.dumps(content_structure, indent=2)