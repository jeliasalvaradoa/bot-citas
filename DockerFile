FROM node:22 as bot
WORKDIR /app-bot
COPY package*.json ./
RUN npm i
COPY . .
ARG OPEN_API_KEY
EXPOSE 3000
CMD ["npm", "start"]
