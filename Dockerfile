# ========================================
# Build
# ========================================
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run prepack

# ========================================
# Runtime
# ========================================
FROM node:18-alpine
WORKDIR /app
COPY --from=mwader/static-ffmpeg:6.0-1 /ffmpeg /usr/local/bin
COPY --from=mwader/static-ffmpeg:6.0-1 /ffprobe /usr/local/bin
COPY --from=build /app/bin ./bin
COPY --from=build /app/dist ./dist
COPY --from=build /app/Docker.sh .
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
RUN apk add --no-cache shadow su-exec && chmod +x Docker.sh && npm install --omit=dev
EXPOSE 7883
ENTRYPOINT ["/app/Docker.sh"]
CMD ["node", "bin/normalasser", "server"]
