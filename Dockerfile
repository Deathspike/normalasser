# ========================================
# Build
# ========================================
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# ========================================
# Runtime
# ========================================
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache ffmpeg
COPY --from=build /app/bin ./bin
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
RUN npm install --omit=dev
EXPOSE 7883
ENTRYPOINT ["node", "bin/normalasser", "server"]
