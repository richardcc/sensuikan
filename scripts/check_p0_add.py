with open('app/js/gameflow_phase0.js', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length of gameflow_phase0.js:", len(text))
# Check if functions already exist
for fn in ['setCaptainTorpedoTraining', 'setXODeckGunTraining', 'setEngineerJudgmentTraining']:
    print(f"{fn} in file:", fn in text)
