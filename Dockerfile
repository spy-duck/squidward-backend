FROM alpine:latest as frontend

WORKDIR /opt/frontend

ARG FRONTEND_URL=https://github.com/spy-duck/squidward-frontend/releases/latest/download/squidward-frontend.zip

RUN apk add --no-cache curl unzip ca-certificates
RUN curl -L ${FRONTEND_URL} -o frontend.zip
RUN unzip frontend.zip -d ./
RUN rm frontend.zip


FROM node:22.19.0-alpine AS backend-build
WORKDIR /opt/app

RUN npm install -g typescript

COPY package*.json ./

COPY node_contracts /opt/squidward-node/libs/contracts

RUN npm ci

COPY . .
RUN npm run build

RUN npm cache clean --force

#RUN npm prune --omit=dev

FROM node:22.19.0-alpine
WORKDIR /opt/app


RUN apk add --no-cache mimalloc curl
ENV LD_PRELOAD=/usr/lib/libmimalloc.so

ENV PM2_DISABLE_VERSION_CHECK=true


COPY --from=backend-build /opt/app/dist ./dist
COPY --from=backend-build /opt/squidward-node /opt/squidward-node
COPY --from=frontend /opt/frontend/dist ./frontend
COPY --from=backend-build /opt/app/node_modules ./node_modules
COPY package*.json ./

COPY ecosystem.config.js ./

RUN npm install pm2 -g \
    && npm link

COPY docker-entrypoint.sh ./

ENTRYPOINT [ "/bin/sh", "docker-entrypoint.sh" ]

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]
