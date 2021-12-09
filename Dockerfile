FROM node:16.6.1

EXPOSE 4000

ENV PORT 4000

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm ci

RUN npm run build

CMD ["node", "dist/index.js"]
