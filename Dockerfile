FROM node:lts-alpine

# Set work directory
WORKDIR /app

COPY . .

# Install dependencies
RUN npm install --omit=dev

RUN npm run build

# Start bot
CMD [ "npm", "run", "start" ]
