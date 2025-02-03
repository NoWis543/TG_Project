# from selenium import webdriver
# from selenium.webdriver.firefox.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.firefox.options import Options
# from selenium.webdriver.common.action_chains import ActionChains
# from selenium.webdriver.common.keys import Keys
# import time

# # Пути к Firefox и Geckodriver
# firefox_path = r"C:\Users\amogu\AppData\Local\Mozilla Firefox\firefox.exe"
# geckodriver_path = r"D:\geckodriver\geckodriver.exe"

# # Настройки Firefox
# options = Options()
# options.binary_location = firefox_path
# #options.add_argument("--headless")  # Можно убрать, если хочешь видеть браузер

# # Запуск браузера
# service = Service(geckodriver_path)
# driver = webdriver.Firefox(service=service, options=options)

# # Каталог комплектующих
# BASE_URL = "https://shop.kz/catalog/komplektuyushchie/"
# CATEGORIES_XPATH = [
#     ("/html/body/div[5]/div[1]/div/div[2]/div/div/ul/li[1]/h2/a", "Все для сборки компьютера"), 
#     ("/html/body/div[5]/div[1]/div/div[2]/div/div/ul/li[2]/h2/a", "Дополнительные комплектующие"), 
# ]
# SUBCATEGORIES_XPATH = {
#     "Все для сборки компьютера": [
#         ("/html/body/div[5]/div[1]/div/div[2]/div/div/ul/li[1]/h2/a", "Процессоры"),
#         ("/html/body/div[4]/div[1]/div/div[2]/div/div/ul/li[2]/h2/a", "Материнские платы"),
#         ("/html/body/div[4]/div[1]/div/div[2]/div/div/ul/li[3]/h2/a", "Оперативная память"),
#         ("/html/body/div[4]/div[1]/div/div[2]/div/div/ul/li[4]/h2/a", "Видеокарты"),
#     ],
#     "Дополнительные комплектующие": [
#         ("/html/body/div[4]/div[1]/div/div[2]/div/div/ul/li[1]/h2/a", "Прочее охлаждение"),
#         ("/html/body/div[4]/div[1]/div/div[2]/div/div/ul/li[2]/h2/a", "Звуковые карты"),
#     ],
# }

# # XPATH для товаров
# PRODUCT_NAME_XPATH = ".//div[3]/a/h4"  
# PRODUCT_PRICE_XPATH = ".//div[6]/div/span[2]"
# OUT_OF_STOCK_XPATH = ".//div[6]/div[1]/span"
# NEXT_PAGE_XPATH = "/html/body/div[4]/div[1]/div/div[2]/div/div/div[2]/div/div[3]/div[6]/div/ul/li[last()]/a/span"

# try:
#     driver.get(BASE_URL)
#     time.sleep(3)

#     # Обход категорий
#     for category_xpath, category_name in CATEGORIES_XPATH:
#         category_element = driver.find_element(By.XPATH, category_xpath)
#         category_element.click()
#         time.sleep(2)

#         for sub_xpath, sub_name in SUBCATEGORIES_XPATH[category_name]:
#             driver.find_element(By.XPATH, sub_xpath).click()
#             time.sleep(2)

#             print(f"\n== {sub_name} ==")

#             while True:
#                 products = driver.find_elements(By.XPATH, "/html/body/div[4]/div[1]/div/div[2]/div/div/div[2]/div/div[3]/div[5]/div")

#                 for product in products:
#                     try:
#                         name = product.find_element(By.XPATH, PRODUCT_NAME_XPATH).text
#                         try:
#                             price = product.find_element(By.XPATH, PRODUCT_PRICE_XPATH).text
#                         except:
#                             price = "Нет в наличии"
#                         print(f"{name} - {price}")
#                     except:
#                         continue

#                 try:
#                     next_page = driver.find_element(By.XPATH, NEXT_PAGE_XPATH)
#                     ActionChains(driver).move_to_element(next_page).click().perform()
#                     time.sleep(2)
#                 except:
#                     break

# finally:
#     driver.quit()
