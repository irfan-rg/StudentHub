import sys
import traceback

try:
    from generate_qna import get_qna
    print("✓ Import successful")
    
    import google.generativeai as genai
    print("✓ Gemini library imported")
    
    # Test API key
    genai.configure(api_key="AIzaSyCmvplxT5l4OcpDuOR3fM_Y83-3JFsOcWo")
    print("✓ API key configured")
    
    # Test model
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✓ Model initialized")
    
    print("\n✅ All imports and initialization successful!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
