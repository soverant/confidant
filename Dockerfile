FROM python:3.9-alpine as build-backend

WORKDIR /app

RUN python3 -m venv ./venv
ENV PATH="/app/venv/bin:$PATH"

COPY ./backend/requirements.txt ./

RUN pip install -r requirements.txt

COPY ./backend ./

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

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Set the working directory
WORKDIR /app


# Front end
COPY --from=build-frontend /app /app/frontend

# Backend
COPY --from=build-backend /app /app/backend
 

COPY ./main.py .

VOLUME ./backend/data    

ENTRYPOINT []
# Run a Python command (replace 'your_script.py' with your actual script)
CMD ["./backend/venv/bin/python", "main.py", "production"]