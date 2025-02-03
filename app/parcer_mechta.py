from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# Настройки Selenium
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()
options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(service=service, options=options)

try:
    # Базовый URL с параметром `page`
    base_url = "https://www.mechta.kz/section/kompyuternye-aksessuary/?setcity=kr&page="

    # Список для хранения товаров
    products = []

    for page_number in range(1, 25):  # До 24 страниц
        driver.get(base_url + str(page_number))
        time.sleep(3)  # Ожидание загрузки

        print(f"Открыта страница {page_number}...")

        # Находим все товары сразу
        product_elements = driver.find_elements(By.XPATH, '//*[@id="q-app"]/div[1]/div/main/div/div/div[3]/div[2]/div[2]/div[2]/div/div//article')

        if not product_elements:
            print(f"Страница {page_number} пустая, парсинг завершен.")
            break

        for product in product_elements:
            try:
                name_element = product.find_element(By.XPATH, './a/div[1]/div[1]')
                name = name_element.text.strip()

                price_element = product.find_element(By.XPATH, './a/div[2]/div[2]/div[1]')
                price = price_element.text.strip()

                products.append({"name": name, "price": price})
                print(f"{name} — {price}")

            except Exception as e:
                print(f"Ошибка парсинга товара: {e}")
                continue

        # Если на странице меньше 24 товаров — это последняя страница
        if len(product_elements) < 24:
            print(f"Последняя страница: {page_number}. Парсинг завершен.")
            break

    print("\nСписок товаров с ценами:")
    for product in products:
        print(f"{product['name']} — {product['price']}")

finally:
    driver.quit()
