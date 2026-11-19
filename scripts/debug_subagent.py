import json

with open(r'C:/Users/Richard/.gemini/antigravity/brain/4cec8853-62d7-415e-9841-305b7055a45a/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        d = json.loads(line)
        if 'tool_calls' in d:
            for tc in d['tool_calls']:
                print(f"Line {i} Tool: {tc.get('name')}")
                if 'script' in str(tc):
                    print(f"  Script: {tc['args'].get('script')}")
        if 'content' in d and 'Browser Step' in d['content']:
            print(f"Line {i} Response: {d['content'][:300]}")
