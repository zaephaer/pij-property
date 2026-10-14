# PIJ Property: production image (built by Coolify from this repo).
# node:sqlite needs Node >= 22.13 (no flag); 24 is what the site is developed on.
FROM node:24-slim

ENV NODE_ENV=production \
    PORT=3000 \
    DB_FILE=/app/data/data.sqlite

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Persistent data lives in these three directories: mount a volume on each in Coolify.
RUN mkdir -p /app/data /app/uploads /app/backups \
 && chown -R node:node /app/data /app/uploads /app/backups

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
