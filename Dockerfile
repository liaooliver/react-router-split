FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 你可以根據實際情況修改啟動指令（以下以 serve 為例）
CMD ["npm", "run", "start"]