# ========================================
# Base Stage
# ========================================
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ========================================
# Dependencies Stage (Puppeteer + Chrome)
# ========================================
FROM base AS deps
RUN apt-get update && apt-get install -y \
    libgconf-2-4 \
    libxss1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libnss3-dev \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    wget \
    gnupg \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# ========================================
# Pruner Stage
# ========================================
FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune --scope=api --docker

# ========================================
# Installer Stage
# ========================================
FROM deps AS installer
WORKDIR /app

# Puppeteer 설정
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 의존성 설치
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# ========================================
# Builder Stage
# ========================================
FROM installer AS builder
WORKDIR /app

# 소스 코드 복사
COPY --from=pruner /app/out/full/ .

# 빌드 실행 (node_modules는 이미 installer에서 설치됨)
RUN pnpm turbo build --filter=api...

# ========================================
# Production Stage
# ========================================
FROM deps AS production
WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PUPPETEER_CACHE_DIR=/.cache/puppeteer

# 빌드된 애플리케이션과 필요한 파일들 복사
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 포트 노출 (이전 프로젝트 기준)
EXPOSE 8080

# 애플리케이션 실행
CMD ["node", "dist/main.js"]