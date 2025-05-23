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


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


CHROMEDRIVER_PATH = "D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe"
CSV_PATH = "D:\\TG Project\\Backend\\app\\storage\\products_technodome.csv"


service = Service(CHROMEDRIVER_PATH)
options = Options()
options.binary_location = r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

def parse_technodom():
    driver = webdriver.Chrome(service=service, options=options)
    url = "https://www.technodom.kz/karaganda/catalog/noutbuki-i-komp-jutery/komplektujuschie"
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    products = []
    page_number = 1

    try:
        while True:
            logging.info(f"Парсим страницу {page_number}...")

            i = 1
            while True:
                try:
                    # Ожидание появления элемента
                    name_xpath = f'//*[@id="__next"]/section/main/section/div/div[2]/article/ul/li[{i}]/a/div/div[2]/div[1]/p'
                    name_element = wait.until(EC.presence_of_element_located((By.XPATH, name_xpath)))
                    name = name_element.text.strip()

                    price_xpath = f'//*[@id="__next"]/section/main/section/div/div[2]/article/ul/li[{i}]/a/div/div[2]/div[3]/p'
                    price_element = wait.until(EC.presence_of_element_located((By.XPATH, price_xpath)))
                    price = price_element.text.replace("₸", "").replace(" ", "").strip()

                    link_xpath = f'//*[@id="__next"]/section/main/section/div/div[2]/article/ul/li[{i}]/a'
                    link_element = wait.until(EC.presence_of_element_located((By.XPATH, link_xpath)))
                    link = link_element.get_attribute("href")

                    products.append({"name": name, "price": int(price), "link": link})
                    logging.info(f"Товар {i}: {name} — {price} ₸ — {link}")

                    i += 1
                except Exception:
                    break  # Если товаров больше нет, переходим к следующей странице

            
            try:
                if page_number == 1:
                    next_button = driver.find_element(By.XPATH, '//*[@id="__next"]/section/main/section/div/div[2]/article/div/div/a')
                else:
                    next_button = driver.find_element(By.XPATH, '//*[@id="__next"]/section/main/section/div/div[2]/article/div/div/a[2]')
                
                next_button.click()
                page_number += 1
                wait.until(EC.staleness_of(next_button)) 
            except Exception:
                logging.info("Парсинг завершен, последняя страница.")
                break

    finally:
        driver.quit()

    
    save_to_csv(products)
    save_to_db(products)
    logging.info("Данные успешно сохранены в CSV и БД!")

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
    """Сохранение данных в PostgreSQL (обновление при совпадении имени)"""
    session = SessionLocal()
    try:
        for product in products:
            existing_product = session.query(Product).filter_by(name=product["name"]).first()
            if existing_product:
                
                existing_product.price = product["price"]
            else:
                new_product = Product(
                    name=product["name"],
                    price=product["price"],
                    category="Технодом",
                    link=product["link"]
                )
                session.add(new_product)
        session.commit()
    except Exception as e:
        print(f"Ошибка при сохранении в БД: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    parse_technodom()
