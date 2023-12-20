FROM node:20

WORKDIR /app

# Install Redis
RUN apt-get update && \
    apt-get install -y redis-server

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 3000

# Start Redis server and your Node.js application
CMD ["sh", "-c", "redis-server & npm start"]
