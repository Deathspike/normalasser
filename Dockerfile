FROM node:24.21.0-alpine
WORKDIR /app
COPY --from=mwader/static-ffmpeg:8.1.2 /ffmpeg /usr/local/bin
COPY --from=mwader/static-ffmpeg:8.1.2 /ffprobe /usr/local/bin
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY bin/docker.js bin/docker.js
COPY src/ src/
USER node
CMD ["node", "bin/docker.js"]
