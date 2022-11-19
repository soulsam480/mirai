FROM node:16.14.2-alpine as pnpm
ENV PNPM_VERSION 7.14.2
RUN apk --no-cache add curl
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node

FROM pnpm as install
ENV NPM_CONFIG_LOGLEVEL error
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY api/package.json ./api/package.json
COPY *.json ./
COPY schema ./schema
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:api


FROM install as builder
WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY api/package.json ./api/package.json
COPY package.json ./
COPY schema ./schema
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --ignore-scripts --reporter=append-only  --filter @mirai/api && \
    pnpm store prune && \
    rm -rf ~/.pnpm-store
COPY --from=install /usr/src/app/api/dist ./api/dist
EXPOSE 4444

CMD ["npm", "run", "start:api"]