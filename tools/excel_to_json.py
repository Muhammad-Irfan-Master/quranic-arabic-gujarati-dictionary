import pandas as pd
import json
from pathlib import Path

print("=" * 60)
print("Quranic Arabic–Gujarati Dictionary")
print("Excel to JSON Converter")
print("=" * 60)

excel_file = Path("../uploads/Dictionary.xlsx")
json_file = Path("../data/database.json")

if not excel_file.exists():
    print(f"\n❌ Excel file not found:\n{excel_file}")
    input("\nPress Enter to Exit...")
    raise SystemExit

# Excel پڑھیں
df = pd.read_excel(excel_file)

# خالی قطاریں حذف کریں
df = df.fillna("")

records = []

for _, row in df.iterrows():

    record = {
        "verse_id": row["verse_id"],
        "verse_key": row["verse_key"],
        "word": row["word"],
        "plain": row["Plan Arabic"],
        "pronunciation_gu": row["meaning"],
        "meaning_gu": row["Gujarati Meaning"],
        "chapter": row["chapter"],
        "para": row["Para no."]
    }

    records.append(record)

# JSON محفوظ کریں
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print(f"\n✅ Total Records : {len(records)}")
print(f"✅ JSON Saved To : {json_file}")

print("\nFinished Successfully.")
input("\nPress Enter to Exit...")
