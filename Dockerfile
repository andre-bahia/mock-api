FROM node:10

WORKDIR /app

COPY . /app

RUN npm config set registry http://registry.npmjs.org/ && npm install

EXPOSE 8081

CMD node server.js