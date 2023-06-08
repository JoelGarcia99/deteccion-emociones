FROM node:current-alpine3.17

WORKDIR /app/backend

COPY . .

RUN npm install -g @nestjs/cli
RUN yarn install

EXPOSE 8500
