FROM node:14
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run chia-client-install
RUN npm run build
COPY dist ./dist

RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime","./dist/index.js"]
