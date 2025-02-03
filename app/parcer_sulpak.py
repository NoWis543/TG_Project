from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import time

# Укажи путь к ChromeDriver
service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()

# Инициализируем WebDriver
driver = webdriver.Chrome(service=service, options=options)

try:
    # Открываем страницу Sulpak
    driver.get("https://www.sulpak.kz/")
    print("Страница открыта!")

    # Закрываем всплывающее окно выбора города
    close_button = driver.find_element(By.XPATH, '//*[@id="popup_city_default"]/div[1]/div/div/div/a[1]')
    close_button.click()
    print("Всплывающее окно закрыто!")

    # Переходим в раздел "Видеокарты"
    videocard_link = driver.find_element(By.XPATH, "/html/body/main/div[2]/div/div[1]/div[1]/a/div[2]")
    videocard_link.click()
    print("Переход в категорию 'Видеокарты' выполнен!")

    time.sleep(3)  # Ожидаем загрузку страницы

    # Дальше можно продолжить парсить видеокарты, например, искать названия и цены
finally:
    driver.quit()
