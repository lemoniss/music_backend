FROM node:18.5.0
ARG argProfile
ENV PROFILE = ${argProfile}
WORKDIR /Users/mac/musit/millim-x-backend_web/src
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 23936
CMD \
    if ["$argProfile" = "dev"] ; \
       then ["npm", "run", "start:dev"]; \
    else if ["$argProfile" = "prod"] ; \
        then ["npm", "run", "start:prod"]; \
    else \
        ["npm", "run", "start:dev"]; \
    fi;
