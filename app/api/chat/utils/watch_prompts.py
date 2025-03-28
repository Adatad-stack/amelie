from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import time
import os

class PromptHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith("prompts_amelie_editable.md"):
            print("📎 prompts_amelie_editable.md modifié. Conversion en cours...")
            subprocess.call(["python", "app/api/chat/utils/convert_md_to_json.py"])

if __name__ == "__main__":
    path = "app/api/chat/prompts"
    if not os.path.exists(path):
        print("❌ Le dossier 'prompts' est introuvable.")
        exit(1)

    event_handler = PromptHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path, recursive=False)
    observer.start()

    print("👀 Surveillance active sur prompts_amelie_editable.md (Ctrl+C pour arrêter)")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n🛑 Surveillance arrêtée.")
    observer.join()