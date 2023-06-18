FROM node:16-alpine
LABEL author="nmduc <dicminhngo1609@gmail.com>"

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

COPY . .

ENV PORT 4000
EXPOSE 4000

RUN yarn build

CMD yarn dev