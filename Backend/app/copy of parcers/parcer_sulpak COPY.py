import csv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Укажи путь к ChromeDriver
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()

# Инициализируем WebDriver
driver = webdriver.Chrome(service=service, options=options)

# Список категорий для парсинга
categories = {
    "Видеокарты": "https://www.sulpak.kz/f/videokartiy",
    "Жесткие диски и SSD": "https://www.sulpak.kz/f/zhestkie_diski_hdd_i_ssd",
    "Кронштейны для мониторов": "https://www.sulpak.kz/f/kronshtejniy_dlya_monitorov",
    "Материнские платы": "https://www.sulpak.kz/f/materinskie_platiy",
    "Оперативная память": "https://www.sulpak.kz/f/operativnaya_pamyat",
    "Процессоры": "https://www.sulpak.kz/f/processoriy"
}

try:
    # Открываем страницу Sulpak
    driver.get("https://www.sulpak.kz/")
    print("Страница открыта!")

    # Ожидаем появления всплывающего окна и нажимаем "Да"
    wait = WebDriverWait(driver, 10)
    confirm_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="popup_city_default"]/div[1]/div/div/div/div[3]/a[2]')))
    confirm_button.click()
    print("Выбор города подтвержден!")
    
    all_products = []
    
    for category_name, category_url in categories.items():
        driver.get(category_url)
        print(f"Перешли в категорию '{category_name}'")
        time.sleep(3)  # Ожидаем загрузку страницы
        
        i = 1
        while True:
            try:
                name_xpath = f'//*[@id="products"]/div[{i}]/div/div/div[2]/div[1]/div[2]/div/a'
                price_xpath = f'//*[@id="products"]/div[{i}]/div/div/div[3]/div[1]/div/div[1]/div[2]'
                
                name_element = driver.find_element(By.XPATH, name_xpath)
                price_element = driver.find_element(By.XPATH, price_xpath)
                
                name = name_element.text
                price = price_element.text
                
                all_products.append([category_name, name, price])
                print(f"{category_name} - Товар {i}: {name} - {price}")
                i += 1
            except:
                break
    
    print("Парсинг завершен! Сохранение в CSV...")
    
    with open("D:\\TG Project\\app\\products_sulpak.csv", mode="w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Категория", "Название товара", "Цена"])
        writer.writerows(all_products)
    
    print("Данные сохранены в sulpak_products.csv")
    
finally:
    driver.quit()
