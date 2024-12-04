FROM node:21

# Set working directory
WORKDIR /app

# Copy the package.json files
COPY package*.json ./app
# COPY tailwind.config.js /app

# Install dependencies
RUN npm install

# Copy the rest of the frontend app
COPY . .

# Expose the port that React app runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
