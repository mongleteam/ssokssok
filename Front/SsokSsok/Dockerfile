FROM node:20-alpine
WORKDIR /src
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5080
CMD ["npm", "run", "dev"]

# 변경용