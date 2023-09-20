FROM node:20-alpine


# Create app directory

WORKDIR /app

# Install app dependencies

COPY package.json ./

RUN npm install

# Copy the .env file to the container
COPY .env .env

# Bundle app source

COPY . .

CMD ["npm", "start"]
