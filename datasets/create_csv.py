import os
import csv
from datetime import datetime
from collections import Counter

DATASET_DIR = r"D:\final-project1\final year project\datasets\data"
OUTPUT_CSV = r"D:\final-project1\final year project\datasets\traffic_data.csv"

# Map folder names to clean display names
CATEGORY_MAP = {
    'garbage': 'Garbage',
    'pothole': 'Pothole',
}

SUBCATEGORY_MAP = {
    ('garbage', 'yes'): 'Has Garbage',
    ('garbage', 'no'):  'No Garbage',
    ('pothole', 'yes'): 'Has Pothole',
    ('pothole', 'no'):  'No Pothole',
}

def generate_csv(image_dir, csv_file):
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
    data_rows = []
    sr = 1

    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Scanning: {image_dir}")

    if not os.path.exists(image_dir):
        print(f"ERROR: Directory not found: {image_dir}")
        return

    for root, dirs, files in os.walk(image_dir):
        dirs[:] = [d for d in dirs if not d.startswith('.')]

        for file in sorted(files):  # sorted for consistent ordering
            if file.lower().endswith(valid_extensions):
                file_path = os.path.join(root, file)

                label_folder    = os.path.basename(root).lower()           # yes / no
                category_folder = os.path.basename(os.path.dirname(root)).lower()  # garbage / pothole

                sr_num       = sr
                category     = CATEGORY_MAP.get(category_folder, category_folder.capitalize())
                sub_category = SUBCATEGORY_MAP.get((category_folder, label_folder), 'Unknown')
                file_name    = file
                extension    = os.path.splitext(file)[1].lstrip('.').upper()  # JPG, PNG, etc.
                label        = label_folder.capitalize()   # Yes / No

                data_rows.append([sr_num, category, sub_category, file_name, extension, label, file_path])
                sr += 1

    if not data_rows:
        print("WARNING: No images found. Check your DATASET_DIR path.")
        return

    # Track previous count for diff
    prev_count = 0
    if os.path.exists(csv_file):
        with open(csv_file, 'r', encoding='utf-8') as f:
            prev_count = sum(1 for _ in f) - 1

    with open(csv_file, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Sr#', 'Category', 'Sub-Category', 'File Name', 'Extension', 'Label', 'Full Path'])
        writer.writerows(data_rows)

    diff = len(data_rows) - prev_count
    diff_str = f"(+{diff})" if diff > 0 else f"({diff})" if diff < 0 else "(no change)"
    print(f"Total images saved : {len(data_rows)} {diff_str}")
    print(f"CSV updated at     : {csv_file}")

    print("\nBreakdown:")
    counts = Counter((row[1], row[2], row[5]) for row in data_rows)
    for (cat, sub, lbl), count in sorted(counts.items()):
        print(f"  {cat:<12} | {sub:<18} | {lbl:<5} | {count} images")

if __name__ == "__main__":
    generate_csv(DATASET_DIR, OUTPUT_CSV)