FROM node:current-alpine3.17

WORKDIR /app/frontend

COPY . .

RUN yarn global add react-scripts
RUN yarn global add typescript
RUN yarn add typescript
RUN yarn install

EXPOSE 8500
