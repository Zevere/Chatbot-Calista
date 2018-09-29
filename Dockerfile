FROM       node:10-alpine as base

FROM       node:10-alpine as build
WORKDIR    /build
COPY       ./package.json .
RUN        npm i
COPY       . .
RUN        npm run build

FROM       base as final
WORKDIR    /app
COPY       --from=build /build/node_modules ./node_modules
COPY       --from=build /build/lib .
COPY       ./.env .
ENTRYPOINT ["node", "index.js"]
