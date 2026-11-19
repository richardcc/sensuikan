import os
import shutil

src_dir = r"C:\Users\Richard\OneDrive - UNED\EnBackup\Richard\Juegos Mesa\_Wargames\Sensuikan\Sensuikan-Japanese_Fleet_Submarines_in_WW2_Ver_1.0.0 - copia\images"
dest_tokens = os.path.abspath("app/assets/tokens")
os.makedirs(dest_tokens, exist_ok=True)

# List of desired files to copy for skills, medals, ranks, kaiten, etc.
desired_patterns = [
    # Captain skills
    "Shibumi.jpg", "Shibumi Used.jpg",
    "Leadership.jpg", "Leadership Used.jpg",
    "Torpedo Gunnery.jpg", "Superior Torp.jpg",
    "Bold.jpg", "Agressive.jpg", "Blessings of the Emperor.jpg", "Scrounger.jpg",
    "Capital Ship Killer.jpg", "Carrier Killer.jpg", "Convoy Killer.jpg",
    "Tanker Killer.jpg", "Straggler Killer.jpg", "Chrismatic.jpg", "Skilled.jpg",

    # Midget skills
    "Midget Torpedo Gunnery.jpg", "Boat Handling.jpg", "Superior Comms.jpg", "Midget Sub Expert.jpg",

    # Air crew skills
    "Weapons Expert.jpg", "Aircraft Maint.jpg", "Aircraft Maint Used.jpg",
    "ACM.jpg", "ACM Used.jpg", "Aerial Navigation.jpg",

    # Medals & Ranks
    "Rank.jpg", "Rank1.jpg", "Rank2.jpg", "Rank3.jpg",
    "Order of the Golden Kite 4th.jpg", "Order of the Golden Kite 5th.jpg",
    "Order of Rising Sun.jpg", "Order of Sacred Treasure.jpg",
    "Great East Asia War Medal.jpg", "Wound Badge.jpg", "Submarine School Badge.jpg",

    # Status / Submarine markers
    "New Sub Chance.jpg", "Promotion -2.jpg", "Promotion -2 Used.jpg",
    "Maneki Neko 1.jpg", "Maneki Neko 2.jpg", "Port Yokosuka.jpg",

    # Crew skills
    "Crew Expert - X0.jpg", "Crew Vigilant - X0 -.jpg", "Vigilant.jpg",
    "Deck Gun Expert.jpg", "AA Expert.jpg",
    "Crew Expert - Eng.jpg", "Mechanical Genius.jpg", "Mechanical Genius Used.jpg",
    "Keen Judgement.jpg", "Keen Judgement Used.jpg",
    "Crew Expert - Nav.jpg",
    "Crew Expert - Med.jpg",

    # Kaiten & spiritual chits
    "Kaiten-1.jpg", "Kaiten-2.jpg", "Kaiten-3.jpg", "Kaiten-4.jpg", "Kaiten-5.jpg", "Kaiten-6.jpg",
    "Hachimaki.jpg", "Hachimaki Used.jpg", "Senninhari.jpg", "Senninhari Used.jpg"
]

copied = []
missing = []

for f in desired_patterns:
    src_path = os.path.join(src_dir, f)
    if os.path.exists(src_path):
        dst_path = os.path.join(dest_tokens, f)
        shutil.copy2(src_path, dst_path)
        copied.append(f)
    else:
        missing.append(f)

print(f"Copied {len(copied)} files to app/assets/tokens.")
if missing:
    print(f"Missing ({len(missing)}):", missing)
