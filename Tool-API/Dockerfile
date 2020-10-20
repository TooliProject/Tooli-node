FROM node:latest

COPY . /app

WORKDIR /app

RUN find ./ -type f -exec sed -i -e 's/'\''\/api/'\''\/apps\/tooli\/api/g' {} \; && \
    find ./ -type f -exec sed -i -e 's/http:\/\/localhost\:3000/https:\/\/server.rynkbit.com\/apps\/tooli/g' {} \; && \
    npm install

CMD npm start
