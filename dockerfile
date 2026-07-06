FROM node:24.18.0-alpine3.24

WORKDIR /usr/src/app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . .

RUN pnpm prisma:generate

EXPOSE 3000