FROM       node:10-alpine as base

FROM       node:10-alpine as build
WORKDIR    /build
COPY       ./package.json .
RUN        npm i
COPY       . .
RUN        npm run build:release

FROM       base as final
WORKDIR    /app
COPY       --from=build /build/dist/release .
COPY       ./.env .
ENTRYPOINT ["node", "index.js"]
