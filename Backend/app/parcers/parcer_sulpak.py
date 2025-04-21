import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Product


service = Service("D:\\ChromeDriver\\chromedriver-win64\\chromedriver.exe")
options = Options()
driver = webdriver.Chrome(service=service, options=options)


categories = {
    "Видеокарты": "https://www.sulpak.kz/f/videokartiy",
    "Жесткие диски и SSD": "https://www.sulpak.kz/f/zhestkie_diski_hdd_i_ssd",
    "Кронштейны для мониторов": "https://www.sulpak.kz/f/kronshtejniy_dlya_monitorov",
    "Материнские платы": "https://www.sulpak.kz/f/materinskie_platiy",
    "Оперативная память": "https://www.sulpak.kz/f/operativnaya_pamyat",
    "Процессоры": "https://www.sulpak.kz/f/processoriy"
}

def save_to_db(name, price, category, link):
    """Сохранение или обновление товара в базе"""
    db: Session = SessionLocal()
    try:
        price = float(price.replace(" ", "").replace("₸", ""))
        existing_product = db.query(Product).filter_by(name=name, category=category).first()
        if existing_product:
            existing_product.price = price
            existing_product.link = link
        else:
            product = Product(name=name, price=price, category=category, link=link)
            db.add(product)
        db.commit()
    except Exception as e:
        print(f"Ошибка сохранения {name}: {e}")
        db.rollback()
    finally:
        db.close()


try:
    driver.get("https://www.sulpak.kz/")
    wait = WebDriverWait(driver, 10)
    
    
    confirm_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="popup_city_default"]/div[1]/div/div/div/div[3]/a[2]')))
    confirm_button.click()

    for category_name, category_url in categories.items():
        driver.get(category_url)
        time.sleep(3)  

        i = 1
        while True:
            try:
                name_xpath = f'//*[@id="products"]/div[{i}]/div/div/div[2]/div[1]/div[2]/div/a'
                price_xpath = f'//*[@id="products"]/div[{i}]/div/div/div[3]/div[1]/div/div[1]/div[2]'
                link_xpath = f'//*[@id="products"]/div[{i}]/div/div/div[2]/div[1]/div[2]/div/a'

                name_element = driver.find_element(By.XPATH, name_xpath)
                price_element = driver.find_element(By.XPATH, price_xpath)
                link_element = driver.find_element(By.XPATH, link_xpath)

                name = name_element.text
                price = price_element.text
                link = link_element.get_attribute("href")

                save_to_db(name, price, category_name, link)
                print(f"Сохранено: {name} - {price}")

                i += 1
            except:
                break

finally:
    driver.quit()
