FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 8080

CMD ["npm", "run", "dev"]

# docker build -t toollib-be .

# docker run -p 8000:3000 -d --name toollib-be -v $(pwd):/app --read-only -v /app/node_modules 26e0b7efba9f

# docker exec -it 6a52d9a5becf bash