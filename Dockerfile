FROM node:18.5.0
WORKDIR /Users/mac/musit/millim-x-backend_web/src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 23936
ARG PROFILE
ENV NODE_ENV=${PROFILE}
#CMD ["node", "dist/main"]
CMD ["sh", "-c", "npm run start:${NODE_ENV}"]
