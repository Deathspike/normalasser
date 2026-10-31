FROM mwader/static-ffmpeg:9.0.2-1 AS ffmpeg
FROM node:24.22.1-alpine
WORKDIR /app
COPY --from=ffmpeg /ffmpeg /usr/local/bin
COPY --from=ffmpeg /ffprobe /usr/local/bin
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY bin/docker.js bin/docker.js
COPY src/ src/
USER node
CMD ["node", "bin/docker.js"]
