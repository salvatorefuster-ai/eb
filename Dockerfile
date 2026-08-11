FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p data uploads
ENV NODE_ENV=production
ENV PORT=3456
EXPOSE 3456
CMD ["node", "server/index.js"]
