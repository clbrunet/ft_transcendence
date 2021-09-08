FROM node:16.8.0

WORKDIR /app

COPY ./ ./

RUN   npm install; npm run build; npm install -g serve;

EXPOSE 8080

CMD ["serve", "--listen", "8080", "--single", "dist"]
