from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
import csv
import os
from app.database import SessionLocal
from app.models import Product

# Настройка логирования
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Пути
CHROMEDRIVER_PATH = "D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe"
CSV_PATH = "D:\\TG Project\\Backend\\app\\storage\\products_mechta.csv"

# Настройки Selenium
service = Service(CHROMEDRIVER_PATH)
options = Options()
options.binary_location = r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

def parse_mechta():
    driver = webdriver.Chrome(service=service, options=options)
    base_url = "https://www.mechta.kz/section/kompyuternye-aksessuary/?setcity=kr&page="
    
    products = []
    page_number = 1

    try:
        while True:
            url = base_url + str(page_number)
            driver.get(url)
            logging.info(f"Открыта страница {page_number}...")

            wait = WebDriverWait(driver, 10)

            try:
                product_elements = wait.until(EC.presence_of_all_elements_located(
                    (By.XPATH, '//*[@id="q-app"]/div[1]/div/main/div/div/div[3]/div[2]/div[2]/div[2]/div/div//article')
                ))
            except Exception:
                logging.info(f"Страница {page_number} пуста, парсинг завершен.")
                break

            for product in product_elements:
                try:
                    name_element = product.find_element(By.XPATH, './a/div[1]/div[1]')
                    name = name_element.text.strip()

                    price_element = product.find_element(By.XPATH, './a/div[2]/div[2]/div[1]')
                    price = price_element.text.replace("₸", "").replace(" ", "").strip()

                    products.append({"name": name, "price": int(price)})
                    logging.info(f"Товар: {name} — {price} ₸")

                except Exception as e:
                    logging.error(f"Ошибка парсинга товара: {e}")
                    continue
            
            page_number += 1  # Переход к следующей странице

    finally:
        driver.quit()

    # Сохранение данных
    save_to_csv(products)
    save_to_db(products)
    logging.info("Данные сохранены в CSV и БД!")

def save_to_csv(products):
    """Сохранение данных в CSV-файл"""
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)  # Создаем папку, если её нет
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, delimiter=";")
        writer.writerow(["Название", "Цена"])
        for product in products:
            writer.writerow([product["name"], product["price"]])
    logging.info(f"Данные сохранены в CSV: {CSV_PATH}")

def save_to_db(products):
    """Сохранение данных в PostgreSQL"""
    session = SessionLocal()
    try:
        for product in products:
            existing_product = session.query(Product).filter_by(name=product["name"]).first()
            if not existing_product:
                new_product = Product(name=product["name"], price=product["price"])
                session.add(new_product)
        session.commit()
    finally:
        session.close()

if __name__ == "__main__":
    parse_mechta()
