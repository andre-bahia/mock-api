FROM node:10

WORKDIR /app

COPY . /app

RUN npm config set registry http://registry.npmjs.org/ && npm install

CMD node server.js

EXPOSE 8081