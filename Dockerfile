FROM postgres:alpine3.17 as postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=deteccion_emociones
COPY ./sql /docker-entrypoint-initdb.d/

# updating packages
RUN apt-get update 

EXPOSE 5432
# installing nodejs fom image 
FROM node:alpine3.16 as node

# creating the workdir
WORKDIR /app

COPY . .

RUN echo "moving to the backend"
RUN cd /app/api

RUN echo "installing the backend dependencies"
RUN yarn

RUN echo "moving to the frontend"
RUN cd /app/cliente
RUN echo "installing the frontend dependencies"
RUN yarn


EXPOSE 8000
EXPOSE 3000

FROM python:3.8.16-slim-bullseye
WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN echo "Installing python dependencies"
RUN pip3 install -r requirements.txt

EXPOSE 8500
