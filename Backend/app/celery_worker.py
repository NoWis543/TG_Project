from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "tg_project",
    broker="redis://192.168.161.94:6379/0",
    backend="redis://192.168.161.94:6379/0",
    include=["app.tasks.tasks"],
)

celery_app.conf.beat_scheduler = "celery.beat:Scheduler" 

celery_app.conf.task_routes = {
    "app.tasks.tasks.*": {"queue": "default"},
}

celery_app.conf.beat_schedule = {
    "run_parser_every_day_at_22_20": {
        "task": "app.tasks.tasks.run_parser",
        "schedule": crontab(minute=20, hour=22),
    },
}

celery_app.conf.timezone = "Asia/Yekaterinburg"

import app.tasks.tasks
