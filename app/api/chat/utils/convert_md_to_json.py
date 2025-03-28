import re
import json
from pathlib import Path

base = Path(__file__).resolve().parent.parent

# --- CONVERT PROMPTS AMÉLIE ---
try:
    md_file_amelie = base / "prompts" / "prompts_amelie_editable.md"
    json_file_amelie = base / "prompts_amelie.json"

    with open(md_file_amelie, "r", encoding="utf-8") as f:
        content = f.read()

    # Extraire le prompt global
    match = re.search(r"## 🧠 CONTENU DU PROMPT GLOBAL\n+(.+?)\n+# 📚 Prompts par phase", content, re.DOTALL)
    if not match:
        raise ValueError("Impossible de localiser le prompt global dans le markdown Amélie")
    system_prompt = match.group(1).strip().replace("\n", "\\n")

    # Phases
    phases = {}
    for phase, texte in re.findall(r"## 🔹 Phase `([^`]+)`\n+> (.+?)(?=\n## 🔹|\Z)", content, re.DOTALL):
        phases[phase] = {
            "reponse": texte.replace("\n> ", "\n").replace("\n\n", "\n").strip().replace("\n", "\\n")
        }

    with open(json_file_amelie, "w", encoding="utf-8") as f:
        json.dump({
            "system_prompt_global": system_prompt,
            "phases": phases
        }, f, ensure_ascii=False, indent=2)
    print("✅ prompts_amelie.json généré")

except Exception as e:
    print("❌ Erreur sur prompts_amelie :", e)

# --- CONVERT PROMPT INTERPRETEUR ---
try:
    md_file_interpreteur = base / "prompts" / "interpreteur_prompt.md"
    json_file_interpreteur = base / "interpreteur_prompt.json"

    with open(md_file_interpreteur, "r", encoding="utf-8") as f:
        content = f.read()

    prompt_clean = content.strip().replace("\n", "\\n")

    with open(json_file_interpreteur, "w", encoding="utf-8") as f:
        json.dump({ "interpreteur_prompt": prompt_clean }, f, ensure_ascii=False, indent=2)
    print("✅ interpreteur_prompt.json généré")

except Exception as e:
    print("❌ Erreur sur interpreteur_prompt :", e)