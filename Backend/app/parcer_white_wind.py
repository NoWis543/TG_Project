import time
import csv
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Product

# Пути к драйверу и Firefox
gecko_path = r"D:\geckodriver\geckodriver.exe"
firefox_binary_path = r"C:\\Users\\amogu\\AppData\\Local\\Mozilla Firefox\\firefox.exe"

# Настройки Selenium
options = Options()
options.binary_location = firefox_binary_path
service = Service(gecko_path)
driver = webdriver.Firefox(service=service, options=options)
wait = WebDriverWait(driver, 10)

# Категории товаров
categories = {
    "Процессоры": "https://shop.kz/karaganda/offers/protsessory/",
    "Материнские платы": "https://shop.kz/karaganda/offers/materinskie-platy/",
    "Оперативная память": "https://shop.kz/karaganda/offers/operativnaya-pamyat/",
    "Видеокарты": "https://shop.kz/karaganda/offers/videokarty/",
    "Жесткие диски": "https://shop.kz/karaganda/offers/zhestkie-diski/",
    "SSD диски": "https://shop.kz/karaganda/offers/ssd-diski/"
}

# Файл CSV
csv_filename = "D:\\TG Project\\app\\products_white_wind.csv"

# Создаем или очищаем CSV
with open(csv_filename, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Название", "Цена", "Категория", "Ссылка"])

def save_to_db(name, price, category, link):
    """Сохранение данных в базу"""
    db: Session = SessionLocal()
    try:
        price = float(price.replace(" ", "").replace("₸", "")) if "₸" in price else None
        product = Product(name=name, price=price, category=category, link=link)
        db.add(product)
        db.commit()
        print(f"Сохранено в БД: {name} - {price}")
    except Exception as e:
        print(f"Ошибка сохранения {name}: {e}")
        db.rollback()
    finally:
        db.close()

def save_to_csv(name, price, category, link):
    """Сохранение данных в CSV"""
    with open(csv_filename, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([name, price, category, link])

def parse_category(category_name, url):
    driver.get(url)
    print(f"Открыта категория: {category_name}")
    
    page = 1
    while True:
        print(f"Парсим страницу {page} категории {category_name}...")
        products = driver.find_elements(By.CLASS_NAME, "bx_catalog_item")

        if not products:
            print("Достигнут конец списка страниц.")
            break

        for index, product in enumerate(products, start=1):
            try:
                name = product.find_element(By.CLASS_NAME, "bx_catalog_item_title_text").text
                
                try:
                    price_element = product.find_element(By.XPATH, ".//div[6]/div/span[2]")
                except:
                    try:
                        price_element = product.find_element(By.XPATH, ".//div[6]/div/span")
                    except:
                        price_element = None
                
                price = price_element.text if price_element else "Цена не найдена"
                link = product.find_element(By.CLASS_NAME, "bx_catalog_item_title").find_element(By.TAG_NAME, "a").get_attribute("href")

                print(f"Товар {index}: {name} - {price} - {link}")
                
                save_to_db(name, price, category_name, link)
                save_to_csv(name, price, category_name, link)

            except Exception as e:
                print(f"Ошибка парсинга товара {index}: {e}")

        # Переход на следующую страницу
        current_url = driver.current_url
        next_buttons = [
            "//div[4]/div/ul/li[7]/a/span",  # Верхняя кнопка
            "//div[6]/div/ul/li[7]/a/span"   # Нижняя кнопка
        ]
        
        next_clicked = False
        for button_xpath in next_buttons:
            try:
                next_button = wait.until(EC.element_to_be_clickable((By.XPATH, button_xpath)))
                driver.execute_script("arguments[0].click();", next_button)
                time.sleep(3)
                
                if driver.current_url != current_url:
                    next_clicked = True
                    break
            except Exception as e:
                print(f"Ошибка при попытке кликнуть по кнопке {button_xpath}: {e}")
        
        if not next_clicked:
            print("Не удалось перейти на следующую страницу, завершаем парсинг категории.")
            break
        
        page += 1

# Запуск парсинга по всем категориям
for category, link in categories.items():
    parse_category(category, link)
    time.sleep(2)

print("Парсинг завершен!")
driver.quit()
