from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import csv

# Настройки Selenium
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()
options.binary_location = r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

driver = webdriver.Chrome(service=service, options=options)

try:
    base_url = "https://www.mechta.kz/section/kompyuternye-aksessuary/?setcity=kr&page="
    products = []
    page_number = 1
    
    while True:
        driver.get(base_url + str(page_number))
        time.sleep(15)  # Ожидание загрузки страницы
        print(f"Открыта страница {page_number}...")
        
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
        
        page_number += 1  # Переход к следующей странице
    
    # Сохранение в CSV
    with open("D:\\TG Project\\app\\products_mechta.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["name", "price"])
        writer.writeheader()
        writer.writerows(products)
    
    print("Данные сохранены в products.csv")

finally:
    driver.quit()
