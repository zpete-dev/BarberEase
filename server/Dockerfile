# Fetching the latest node image on alpine linux
FROM node:alpine

# Setting up the work directory
WORKDIR /server

# Installing dependencies
COPY ./package*.json .

RUN npm install

# Copying all the files in our project
COPY . .

# Define the port exposed for backend
EXPOSE 5000

# Starting our application
CMD ["npm","start"]