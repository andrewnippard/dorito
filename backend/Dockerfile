FROM python:3.7-alpine

RUN apk update && \
    apk add --virtual build-deps gcc python3-dev musl-dev && \
    apk add postgresql-dev

COPY requirements.txt /
RUN pip install -r /requirements.txt

COPY . /app
WORKDIR /app
RUN python manage.py collectstatic --no-input

ENV DJANGO_DEBUG=0
ENV DJANGO_SU_NAME=admin
ENV DJANGO_SU_EMAIL=admin@project.com
ENV DJANGO_SU_PASSWORD=test1234

EXPOSE 8000