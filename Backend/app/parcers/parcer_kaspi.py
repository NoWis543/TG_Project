import csv
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from app.database import SessionLocal
from app.models import Product

# Укажи путь к ChromeDriver
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()
driver = webdriver.Chrome(service=service, options=options)

categories = {
    "Жесткие диски и SSD": "https://kaspi.kz/shop/karaganda/c/hard%20drives/?q=%3Acategory%3AHard%20drives%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Оперативная память": "https://kaspi.kz/shop/karaganda/c/ram/?q=%3Acategory%3ARAM%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Кулеры и охлаждение": "https://kaspi.kz/shop/karaganda/c/fans%20and%20cooling/?q=%3Acategory%3AFans%20and%20cooling%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Видеокарты": "https://kaspi.kz/shop/karaganda/c/videocards/?q=%3Acategory%3AVideocards%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Корпуса": "https://kaspi.kz/shop/karaganda/c/computer%20cases/?q=%3Acategory%3AComputer%20cases%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Блоки питания": "https://kaspi.kz/shop/karaganda/c/power%20supplies/?q=%3Acategory%3APower%20supplies%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Материнские платы": "https://kaspi.kz/shop/karaganda/c/motherboards/?q=%3Acategory%3AMotherboards%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Процессоры": "https://kaspi.kz/shop/karaganda/c/cpus/?q=%3Acategory%3ACPUs%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Термопасты": "https://kaspi.kz/shop/karaganda/c/thermal%20paste/?q=%3Acategory%3AThermal%20paste%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Аксессуары для модинга": "https://kaspi.kz/shop/karaganda/c/accessories%20for%20modding/?q=%3Acategory%3AAccessories%20for%20modding%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Звуковые карты": "https://kaspi.kz/shop/karaganda/c/sound%20cards/?q=%3Acategory%3ASound%20cards%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Оптические приводы": "https://kaspi.kz/shop/karaganda/c/optical%20drivers/?q=%3Acategory%3AOptical%20drivers%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Внешние корпуса и держатели для видеокарт": "https://kaspi.kz/shop/karaganda/c/holders%20for%20video%20cards/?q=%3Acategory%3AHolders%20for%20video%20cards%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Крепления для вентиляторов": "https://kaspi.kz/shop/karaganda/c/mounts%20for%20fans/?q=%3Acategory%3AMounts%20for%20fans%3AavailableInZones%3A351010000&sort=relevance&sc=",
    "Решетки и фильтры для вентиляторов": "https://kaspi.kz/shop/karaganda/c/grilles%20and%20filters%20for%20fans/?q=%3Acategory%3AGrilles%20and%20filters%20for%20fans%3AavailableInZones%3A351010000&sort=relevance&sc="
}

file_path = "D:\\TG Project\\Backend\\app\\storage\\products_kaspi.csv"


def clean_price(price_str):
    """Удаляет символ валюты и пробелы, преобразует в float"""
    return float(re.sub(r"[^\d.]", "", price_str))


def save_to_csv(data):
    """Сохранение данных в CSV-файл"""
    with open(file_path, mode="a", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(data)


def save_to_db(data):
    """Сохранение данных в PostgreSQL"""
    session = SessionLocal()
    try:
        for category, name, price, link in data:
            product = Product(
                category=category,
                name=name,
                price=price,
                link=link
            )
            session.add(product)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Ошибка при сохранении в БД: {e}")
    finally:
        session.close()


def parse_kaspi():
    """Основная функция парсинга Kaspi"""
    with open(file_path, mode="w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Категория", "Название товара", "Цена", "Ссылка"])

    for category, url in categories.items():
        print(f"Парсим категорию: {category}")
        driver.get(url)
        time.sleep(3)
        all_products = []
        save_counter = 0
        save_interval = 500
        page_number = 1

        while True:
            print(f"Обрабатываем страницу {page_number}...")

            for i in range(1, 13):  # 12 товаров на странице
                try:
                    name_xpath = f'//*[@id="scroll-to"]/div[4]/div[1]/div[{i}]/div[2]/div[1]/a'
                    price_xpath = f'//*[@id="scroll-to"]/div[4]/div[1]/div[{i}]/div[2]/div[3]/div[1]/span[2]'

                    name_element = driver.find_element(By.XPATH, name_xpath)
                    price_element = driver.find_element(By.XPATH, price_xpath)

                    name = name_element.text.strip()
                    price = clean_price(price_element.text.strip())  # Очистка цены
                    link = name_element.get_attribute("href")   # Получаем ссылку на товар
                    
                    all_products.append([category, name, price, link])
                    save_counter += 1
                    print(f"Товар {i}: {name} - {price} ({link})")

                    if save_counter >= save_interval:
                        save_to_csv(all_products)
                        save_to_db(all_products)
                        all_products = []
                        save_counter = 0
                        print("Частичное сохранение...")
                except Exception as e:
                    print(f"Ошибка при обработке товара {i}: {e}")
                    continue

            try:
                next_button = driver.find_element(By.XPATH, '//*[@id="scroll-to"]/div[4]/div[2]/li[7]')
                if "disabled" in next_button.get_attribute("class"):
                    print("Достигнута последняя страница.")
                    break
                next_button.click()
                page_number += 1
                time.sleep(3)
            except Exception as e:
                print("Кнопка перехода на следующую страницу не найдена или недоступна.")
                break

        if all_products:
            save_to_csv(all_products)
            save_to_db(all_products)
            print("Финальное сохранение...")

    print("Парсинг завершен.")
    driver.quit()


if __name__ == "__main__":
    parse_kaspi()
