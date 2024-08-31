# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.36

# pull in EdgeDB CLI
FROM edgedb/edgedb as edgedb

# pull bun
FROM oven/bun:${BUN_VERSION}-slim as base

# base
# FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV PORT 8080
ENV EDGEDB_CLIENT_TLS_SECURITY insecure
ENV GOSU_VERSION 1.11

# Install deps
RUN apt-get update && apt-get install -y openssl sqlite3 curl

SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/local/share/keyrings && \
    curl --proto '=https' --tlsv1.2 -sSf \
    -o /usr/local/share/keyrings/edgedb-keyring.gpg \
    https://packages.edgedb.com/keys/edgedb-keyring.gpg && \
    echo deb [signed-by=/usr/local/share/keyrings/edgedb-keyring.gpg]\
    https://packages.edgedb.com/apt \
    $(grep "VERSION_CODENAME=" /etc/os-release | cut -d= -f2) main \
    | tee /etc/apt/sources.list.d/edgedb.list

RUN apt-get update && apt-get install -y edgedb-5



FROM base as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install --ci

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
# COPY --from=edgedb /usr/bin/edgedb /usr/bin/edgedb
# COPY --from=build /usr/local/bin/bun /usr/local/bin/bun

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "start" ]
