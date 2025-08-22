# ========== Base deps layer ==========
FROM node:18-alpine AS deps
WORKDIR /app

# Copy lock files để cache layer tốt hơn
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ========== Builder layer ==========
FROM node:18-alpine AS builder
WORKDIR /app

# Copy toàn bộ deps (bao gồm devDeps) để build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# ========== Runner (production) ==========
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Tạo user non-root để bảo mật
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Chỉ copy những thứ cần thiết
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Chạy với user non-root
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
