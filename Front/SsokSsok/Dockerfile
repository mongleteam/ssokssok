FROM node:20-alpine
WORKDIR /src
COPY package.json .
RUN pnpm install
COPY . .
EXPOSE 5080
CMD ["pnpm", "run", "dev"]

# 변경용