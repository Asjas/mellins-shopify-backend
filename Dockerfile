FROM node:16.6.1

EXPOSE 4000

ENV NODE_ENV production
ENV PORT 4000

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm ci

RUN npm run build:docker

CMD ["node", "dist/index.mjs"]
