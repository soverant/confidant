FROM python:3.9-alpine as build-backend

WORKDIR /app

# Sets utf-8 encoding for Python et al
ENV LANG=C.UTF-8
# Turns off writing .pyc files; superfluous on an ephemeral container.
ENV PYTHONDONTWRITEBYTECODE=1
# Seems to speed things up
ENV PYTHONUNBUFFERED=1

RUN python -m venv /venv

ENV PATH="/venv/bin:$PATH"

COPY ./backend/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt


ARG API_BASE_URL=https://soverant.darkube.app
# Install dependencies only when needed
FROM node:18-alpine AS build-frontend
ENV NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./frontend/package.json ./frontend/yarn.lock* ./frontend/package-lock.json* ./frontend/pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY ./frontend ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
 ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi




FROM node:18-alpine AS runner

RUN apk add --no-cache python3

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Extra python env
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"

# Set the working directory
WORKDIR /app

COPY --from=build-backend /venv /venv

# Front end
COPY --from=build-frontend /app /app/frontend

# Backend
COPY ./backend /app/backend



COPY ./main.py .

VOLUME ./backend/data    

ENTRYPOINT []

RUN ls -lah /venv/bin/

# Run a Python command (replace 'your_script.py' with your actual script)
CMD ["python", "main.py", "production"]