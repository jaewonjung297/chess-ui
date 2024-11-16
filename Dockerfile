# Step 1: Build the app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app’s code to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app
FROM nginx:alpine

# Copy the built files from the previous stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
