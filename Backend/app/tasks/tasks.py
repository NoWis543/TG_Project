#print("[DEBUG] Модуль tasks.py был импортирован")

from celery import shared_task
import subprocess
import os

@shared_task
def run_parser():
    print("[CELERY] 🟢 Тестовая задача выполнена")
    try:
        python_path = r"D:\TG Project\Backend\env\Scripts\python.exe"

        env_vars = dict(os.environ)
        env_vars.pop("celery_broker_url", None)
        env_vars.pop("celery_result_backend", None)
        
        result = subprocess.run(
            [python_path, "-m", "app.parcers.parcer_sulpak"],
            capture_output=True,
            text=True,
            cwd=r"D:\TG Project\Backend",
            env=env_vars
        )


        print("[CELERY] STDOUT:\n", result.stdout)
        print("[CELERY] STDERR:\n", result.stderr)

        return f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    except Exception as e:
        print("[CELERY] Ошибка запуска парсера:", e)
        return str(e)

