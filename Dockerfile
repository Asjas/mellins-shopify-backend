FROM node:16.6.1-alpine

EXPOSE 4000

ENV NODE_ENV production
ENV PORT 4000

RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --production && npm cache clear --force
COPY --chown=node:node . .

RUN npm run build:docker

CMD ["node", "dist/index.mjs"]
