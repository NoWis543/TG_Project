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
import time


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


CHROMEDRIVER_PATH = "D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe"
CSV_PATH = "D:\\TG Project\\Backend\\app\\storage\\products_mechta.csv"


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

            
            try:
                wait_popup = WebDriverWait(driver, 5)
                close_button = wait_popup.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="popmechanic-form-106218"]/button')))
                close_button.click()
                logging.info("Всплывающее окно закрыто.")
                time.sleep(2)
            except:
                logging.info("Всплывающее окно не появилось.")

            wait = WebDriverWait(driver, 10)

            try:
                product_elements = wait.until(EC.presence_of_all_elements_located(
                    (By.XPATH, '//article')
                ))

            except Exception:
                logging.info(f"Страница {page_number} пуста, парсинг завершен.")
                break

            for index, product in enumerate(product_elements, start=1):
                try:
                    name_element = product.find_element(By.XPATH, './/section[1]/a/section[3]/p')
                    price_element = product.find_element(By.XPATH, './/section[1]/a/section[4]/section/p[1]')
                    link_element = product.find_element(By.XPATH, './/section[1]/a')

                    name = name_element.text.strip()
                    price = price_element.text.replace("₸", "").replace(" ", "").strip()
                    link = link_element.get_attribute("href")

                    products.append({"name": name, "price": int(price), "link": link})
                    logging.info(f"Товар {index}: {name} — {price} ₸ ({link})")

                except Exception as e:
                    logging.error(f"Ошибка парсинга товара: {e}")
                    continue

            page_number += 1

    finally:
        driver.quit()

    save_to_csv(products)
    save_to_db(products)
    logging.info("Данные сохранены в CSV и БД!")



def save_to_csv(products):
    """Сохранение данных в CSV-файл"""
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)  
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, delimiter=";")
        writer.writerow(["Название", "Цена"])
        for product in products:
            writer.writerow([product["name"], product["price"]])
    logging.info(f"Данные сохранены в CSV: {CSV_PATH}")

def save_to_db(products):
    """Сохранение данных в PostgreSQL с обновлением, если товар уже существует"""
    session = SessionLocal()
    try:
        for product in products:
            existing = session.query(Product).filter_by(name=product["name"], category="Mechta").first()
            if existing:
                existing.price = product["price"]
                existing.link = product["link"]  
            else:
                new_product = Product(
                    name=product["name"],
                    price=product["price"],
                    category="Mechta",
                    link=product["link"]
                )
                session.add(new_product)
        session.commit()
    finally:
        session.close()



if __name__ == "__main__":
    parse_mechta()
