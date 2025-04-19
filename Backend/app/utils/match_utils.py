import difflib
import re

# Карта синонимов для замены
SYNONYMS = {
    "видеокарта": "видеокарты",
    "процессор": "процессоры",
    "оперативная память": "оперативная память",
    "озу": "оперативная память",
    "блок питания": "блоки питания",
    "жесткий диск": "накопители",
    "ssd": "накопители",
    "hdd": "накопители",
}

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)  # убрать лишние пробелы
    for src, target in SYNONYMS.items():
        text = text.replace(src, target)
    return text.strip()

def fuzzy_match(
    gpt_lines: list[str],
    products: list[dict],
    threshold: float = 0.5,
    return_unmatched: bool = False
):
    matched = []
    unmatched = []

    for gpt_line in gpt_lines:
        norm_line = normalize(gpt_line)
        found = False

        for product in products:
            combined = f"{product['name']} {product['category']}"
            combined_norm = normalize(combined)

            similarity = difflib.SequenceMatcher(None, norm_line, combined_norm).ratio()
            if similarity >= threshold:
                matched.append(product)
                found = True
                break  # Один матч на строку

        if not found and return_unmatched:
            unmatched.append(gpt_line)

    return (matched, unmatched) if return_unmatched else matched
