import json

transcript_path = 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/.system_generated/logs/transcript.jsonl'
with open(transcript_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if i in range(1860, 1885):
            data = json.loads(line)
            src = data.get('source', '')
            t = data.get('type', '')
            content = data.get('content', '')
            tool_calls = data.get('tool_calls', [])
            print(f'=== Line {i} [{src}|{t}] ===')
            if content:
                print('Content:', content[:500])
            if tool_calls:
                print('Tool calls:', tool_calls)
