import os
import pandas as pd
import re
from datasets import load_dataset
import random

# --- Configuration ---
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BACKEND_DIR, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "dataset.csv")

os.makedirs(DATA_DIR, exist_ok=True)

def clean(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", " URL ", text)
    text = re.sub(r"\d+", " NUM ", text)
    text = re.sub(r"[^\w\s!?.,]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def get_huggingface_data():
    print("[*] Fetching data from Hugging Face (GonzaloA/fake_news)...")
    try:
        ds = load_dataset("GonzaloA/fake_news")
        data = []
        for row in ds["train"]:
            title = row.get("title", "") or ""
            body = row.get("text", "") or ""
            text = clean(f"{title}. {body}")
            if len(text) < 30:
                continue
            verdict = "Reliable" if row["label"] == 1 else "Misleading"
            data.append({"text": text, "label": verdict, "source": "huggingface_fake_news"})
        
        # Take a healthy sample
        random.seed(42)
        random.shuffle(data)
        return data[:15000] 
    except Exception as e:
        print(f"[!] Error loading Hugging Face data: {e}")
        return []

def get_synthetic_uncertain():
    print("[*] Generating synthetic uncertain samples...")
    samples = [
        "Sources suggest the government is considering new economic policies next quarter.",
        "Some analysts believe tech layoffs might continue, though others dispute this view.",
        "Officials are reportedly evaluating options; no final decision has been announced.",
        "Preliminary studies hint at a possible link between diet and cognition.",
        "The candidate has neither confirmed nor denied intentions to run for office.",
        "Early data suggests possible slowdown, though economists remain cautious.",
        "Multiple unnamed sources claim backdoor negotiations are at a sensitive stage.",
        "The outcome remains unclear as both parties continued discussions privately.",
        "Reports indicate possible progress on trade deal, but talks are ongoing.",
        "Insiders suggest changes are coming but could not provide specific details.",
        "New findings may indicate a connection, however researchers caution against conclusions.",
        "The company reportedly explored a merger though no official statement was issued.",
        "Some evidence suggests the policy may have unintended effects on low-income households.",
        "Experts are divided on whether this approach will succeed in the long run.",
        "A leaked memo allegedly shows internal disagreement within the administration.",
        "The study, while promising, has not yet been peer-reviewed or replicated.",
        "Certain groups dispute these statistics though the methodology remains unclear.",
        "The situation remains fluid and new information may change the current assessment.",
        "Officials were tight-lipped when asked about plans for the upcoming fiscal year.",
        "Analysts are watching closely as conflicting indicators emerge from the latest data.",
    ]
    data = []
    for s in samples:
        for _ in range(60): # Boost weight
            data.append({"text": clean(s), "label": "Uncertain", "source": "synthetic"})
    return data

def main():
    hf_data = get_huggingface_data()
    syn_data = get_synthetic_uncertain()
    
    combined = hf_data + syn_data
    df = pd.DataFrame(combined)
    
    print(f"[*] Total samples captured: {len(df)}")
    print(df['label'].value_counts())
    
    df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8')
    print(f"\n[SUCCESS] Dataset consolidated into: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
