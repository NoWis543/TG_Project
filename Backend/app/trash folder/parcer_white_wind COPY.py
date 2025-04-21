from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import time

# Пути к драйверу и Firefox
gecko_path = r"D:\geckodriver\geckodriver.exe"
firefox_binary_path = r"C:\\Users\\amogu\\AppData\\Local\\Mozilla Firefox\\firefox.exe"

options = Options()
options.binary_location = firefox_binary_path

service = Service(gecko_path)
driver = webdriver.Firefox(service=service, options=options)
wait = WebDriverWait(driver, 10)

# Список категорий
categories = {
    "Процессоры": "https://shop.kz/karaganda/offers/protsessory/",
    "Материнские платы": "https://shop.kz/karaganda/offers/materinskie-platy/",
    "Оперативная память": "https://shop.kz/karaganda/offers/operativnaya-pamyat/",
    "Видеокарты": "https://shop.kz/karaganda/offers/videokarty/",
    "Жесткие диски": "https://shop.kz/karaganda/offers/zhestkie-diski/",
    "SSD диски": "https://shop.kz/karaganda/offers/ssd-diski/",
    "Блоки питания": "https://shop.kz/karaganda/offers/bloki-pitaniya/",
    "Корпуса": "https://shop.kz/karaganda/offers/korpusa/",
    "Кулеры для процессора": "https://shop.kz/karaganda/offers/kulery-dlya-protsessora/",
    "Системы водяного охлаждения": "https://shop.kz/karaganda/offers/vodyanoe-okhlazhdenie/",
    "Термопасты": "https://shop.kz/karaganda/offers/termopasta/",
    "Оптические дисководы": "https://shop.kz/karaganda/offers/opticheskie-diskovody-privody/",
    "Прочее охлаждение": "https://shop.kz/karaganda/offers/prochee-okhlazhdenie/",
    "Звуковые карты": "https://shop.kz/karaganda/offers/zvukovye-karty/",
    "Карты видеозахвата": "https://shop.kz/karaganda/offers/karty-videozakhvata/",
    "Адаптеры, контроллеры": "https://shop.kz/karaganda/offers/adaptery-kontrollery/",
    "Корпуса для дисков": "https://shop.kz/karaganda/offers/dok-stantsii-korpusa-dlya-diskov/"
}

data = []

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
                
                print(f"Товар {index}: {name} - {price}")
                data.append([category_name, name, price])
            except Exception as e:
                print(f"Ошибка парсинга товара {index}: {e}")
        
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

# Сохранение данных в CSV
csv_path = r"D:\TG Project\app\products_white_wind.csv"
with open(csv_path, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Категория", "Название", "Цена"])
    writer.writerows(data)

print(f"Парсинг завершен! Данные сохранены в {csv_path}")
driver.quit()
