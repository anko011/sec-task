FROM node:20-alpine
LABEL authors="Anko"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 8080

CMD ["npm", "run", "preview", "--workspace=apps/web"]