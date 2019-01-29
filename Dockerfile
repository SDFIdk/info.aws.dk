FROM node:10.15.0-slim

# Create app directory
WORKDIR /info.aws.dk

# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

WORKDIR public

RUN npm install

EXPOSE 3000

WORKDIR /info.aws.dk
CMD [ "npm", "start" ]