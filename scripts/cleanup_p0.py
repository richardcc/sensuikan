with open('app/js/gameflow_phase0.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the repeated setCaptainTorpedoTraining blocks
import re
text = re.sub(r'(\s*function setCaptainTorpedoTraining[\s\S]*?saveState\(\);\s*\})', '', text)
text = re.sub(r'(\s*function setXODeckGunTraining[\s\S]*?saveState\(\);\s*\})', '', text)
text = re.sub(r'(\s*function setEngineerJudgmentTraining[\s\S]*?saveState\(\);\s*\})', '', text)
text = re.sub(r'(\s*function setF2Torpedo[\s\S]*?saveState\(\);\s*\})', '', text)
text = re.sub(r'(\s*function setF2Comms[\s\S]*?saveState\(\);\s*\})', '', text)
text = re.sub(r'(\s*function setF2Net[\s\S]*?saveState\(\);\s*\})', '', text)

with open('app/js/gameflow_phase0.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned up gameflow_phase0.js. New length:", len(text))
