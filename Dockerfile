FROM oven/bun:1.2-debian

WORKDIR /app

COPY . .

WORKDIR /app/frontend

RUN bun install
RUN bun run build

WORKDIR /app

RUN bun install

ENV PORT=3000

EXPOSE 3000

CMD [ "bun", "server/index.ts" ]