FROM python:3.10.6-slim-buster
WORKDIR /app/predictor

COPY . .
RUN apt-get update && apt-get install -y libblas-dev
RUN apt-get install -y libgl1-mesa-glx
RUN apt-get install -y libglib2.0-0
RUN pip install -r requirements.txt
