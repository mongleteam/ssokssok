FROM node:20-alpine
WORKDIR /src
RUN apk add --no-cache curl \
    && curl -fsSL https://get.pnpm.io/install.sh | sh - \
    && ln -s /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm
COPY package.json .
RUN pnpm install
COPY . .
EXPOSE 5080
CMD ["pnpm", "run", "dev"]

# 변경용