FROM node:18.5.0
WORKDIR /Users/mac/musit/millim-x-backend_web/src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 23936
CMD ["node", "dist/main"]
