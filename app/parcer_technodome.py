from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# Настройка драйвера
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()
options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

driver = webdriver.Chrome(service=service, options=options)

try:
    # Открытие категории "Комплектующие"
    driver.get("https://www.technodom.kz/karaganda/catalog/noutbuki-i-komp-jutery/komplektujuschie")
    time.sleep(3)  # Ожидание загрузки страницы

    # Список для хранения товаров с ценами
    products = []

    # Цикл для прохода по страницам
    page_number = 1  # Переменная для отслеживания текущей страницы
    while True:
        i = 1  # Индекс для товаров на текущей странице
        while True:
            try:
                # Получаем название товара по XPATH
                name_xpath = f'//*[@id="__next"]/section/main/section/div/div[2]/article/ul/li[{i}]/a/div/div[2]/div[1]/p'
                name_element = driver.find_element(By.XPATH, name_xpath)
                name = name_element.text

                # Получаем цену товара по XPATH
                price_xpath = f'//*[@id="__next"]/section/main/section/div/div[2]/article/ul/li[{i}]/a/div/div[2]/div[3]/p'
                price_element = driver.find_element(By.XPATH, price_xpath)
                price = price_element.text

                # Сохраняем название и цену
                products.append({"name": name, "price": price})
                print(f"Товар {i}: {name} — {price}")
                i += 1  # Переходим к следующему товару
            except Exception:
                # Прерываем цикл, если товары на странице закончились
                break
        
        # Пытаемся найти и кликнуть на кнопку следующей страницы
        try:
            if page_number == 1:
                # На первой странице используем первый XPATH
                next_button = driver.find_element(By.XPATH, '//*[@id="__next"]/section/main/section/div/div[2]/article/div/div/a')
            else:
                # На второй и последующих страницах используем второй XPATH
                next_button = driver.find_element(By.XPATH, '//*[@id="__next"]/section/main/section/div/div[2]/article/div/div/a[2]')
            
            next_button.click()  # Кликаем на кнопку следующей страницы
            page_number += 1  # Переходим на следующую страницу
            time.sleep(3)  # Ожидаем загрузки страницы
            print(f"Переход на страницу {page_number}...")
        except Exception:
            # Если кнопки нет (например, последняя страница), завершаем цикл
            print("Не удалось найти кнопку следующей страницы, заканчиваем парсинг.")
            break

    print("\nСписок товаров с ценами:")
    for product in products:
        print(f"{product['name']} — {product['price']}")

finally:
    driver.quit()
