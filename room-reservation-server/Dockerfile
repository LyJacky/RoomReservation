# Use the official Node.js image as a base
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Install the dependencies (including nodemon)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Start the Node.js server with nodemon
CMD ["npx", "nodemon", "server.js"]
