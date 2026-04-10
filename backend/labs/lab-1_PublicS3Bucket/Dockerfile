FROM python:3.9

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

EXPOSE 5001

CMD ["sh", "-c", "python -m app.db_init && python run.py"]
