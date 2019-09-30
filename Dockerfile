FROM node:10.16.3

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 8081

CMD node server.js