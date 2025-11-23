import google.generativeai as genai
import json

# Keep the same API key as your environment
genai.configure(api_key="AIzaSyCmvplxT5l4OcpDuOR3fM_Y83-3JFsOcWo")

models = genai.list_models()

print('Available models:')
for m in models:
    print(f"- {m.name}: capabilities={getattr(m, 'capabilities', 'unknown')} | input_types={getattr(m, 'input_types', 'unknown')}")

# Save to file for inspection
with open('models_list.json', 'w') as f:
    json.dump([{
        'name': getattr(m, 'name', ''),
        'displayName': getattr(m, 'display_name', ''),
        'capabilities': getattr(m, 'capabilities', None),
        'inputTypes': getattr(m, 'input_types', None)
    } for m in models], f, indent=2)
print('Saved to models_list.json')