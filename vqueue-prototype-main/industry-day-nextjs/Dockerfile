# Step 1: Use the official Node.js image as a base
FROM node:18 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Build the Next.js application
RUN npm run build

# Step 6: Use a smaller image for running the application
FROM node:18-slim

# Step 7: Set the working directory
WORKDIR /app

# Step 8: Copy the built application and node_modules from the build stage
COPY --from=build /app/.next /app/.next
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json

# Step 9: Expose the port the app runs on
EXPOSE 3000

# Step 10: Define the command to run the application
CMD ["npm", "start"]
