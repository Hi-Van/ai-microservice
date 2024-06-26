# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.9.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Then, we need to copy our package.json and .env file into the image root folder. 
COPY package.json ./

# Then, we need to install the dependencies inside the base image
RUN npm install

# After installing the dependencies, we need to copy the src folder from our local file into the base image
COPY src ./src

# Copy tsconfig.json to base image too
COPY tsconfig.json ./tsconfig.json

# Then, run the build command, this will compile the ts files into javascript files
RUN npm run build

# After using base image for build process, we can create another image for the production build
# Start production image build, we will use the same node image
FROM node:${NODE_VERSION}-alpine

# Copy node modules and build directory from base image to new image
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base /dist /dist

# Expose port 3000, and start the app.
EXPOSE 3000
CMD npm run serve