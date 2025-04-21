import re
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def ask_gpt(prompt: str) -> list[str]:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Ты — помощник по сборке ПК. Отвечай списком комплектующих в формате '1. Название'."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=500,
    )
    text = response.choices[0].message.content.strip()

    # Извлека строки вида "1. Название", "2. Название", ...
    components = re.findall(r"\d+\.\s*(.+)", text)

    return components if components else [text]
