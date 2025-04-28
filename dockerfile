# ---- 建置階段 (Build Stage) ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package.json ./
    COPY package-lock.json* ./
    
    # 安裝所有依賴 (包含 devDependencies)
    RUN npm install
    
    COPY . .
    
    # 執行建置
    RUN npm run build
    
    # ---- 生產階段 (Production Stage) ----
    FROM node:20-alpine
    
    WORKDIR /app
    
    # 只複製生產必要的 package 檔案
    COPY package.json ./
    COPY package-lock.json* ./
    
    # 只安裝生產依賴 (dependencies)
    # react-router-serve 在 dependencies 中，所以會被安裝
    RUN npm install --omit=dev
    
    # 從建置階段複製建置好的檔案
    COPY --from=builder /app/build ./build
    
    # 暴露連接埠
    EXPOSE 3000
    
    # 啟動指令
    CMD ["npm", "run", "start"]
    