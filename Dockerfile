FROM postgres:bullseye as postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=deteccion_emociones
COPY ./sql /docker-entrypoint-initdb.d/

EXPOSE 5432

# creating the workdir
WORKDIR /app

# I N S T A L L I N G   N O D E . J S
RUN apt-get update && apt upgrade -y
RUN apt-get install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g yarn

COPY . .

RUN echo "moving to the backend"
RUN echo "Instalando dependencias del backend"
RUN cd /app/api && yarn

RUN echo "Yendo al frontend"
RUN echo "Instalando dependencias del frontend"
RUN cd /app/cliente && yarn

RUN apt-get update && \
  apt-get install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget && \
  wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz && \
  tar -xf Python-3.10.0.tgz && \
  cd Python-3.10.0 && \
  ./configure --enable-optimizations && \
  make -j 8 && \
  make altinstall

RUN wget https://bootstrap.pypa.io/get-pip.py && \
  python3.10 get-pip.py

COPY requirements.txt /app/requirements.txt
RUN echo "Installing python dependencies"
RUN pip3 install -r requirements.txt

EXPOSE 8500
EXPOSE 8000
EXPOSE 3000
