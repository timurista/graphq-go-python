# FROM python:3.7
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

RUN pip install pipenv
RUN set -ex && mkdir /pyapp
WORKDIR /pyapp
COPY . .

# -- Install dependencies:
RUN pipenv lock -r > requirements.txt
RUN pip install -r requirements.txt

CMD [ "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000" ]
EXPOSE 8000