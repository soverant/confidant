# Stage 1: Build Next.js application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY ./frontend/ .
ENV NEXT_PUBLIC_API_BASE_URL http://localhost:8001
# Build the Next.js application
RUN npm run build

# Stage 2: Final stage with Node.js, npm, and Python 3.9
FROM node:18



# Install Python 3.9 and other dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip mitmproxy && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
 
RUN pip install mitmproxy

COPY ./backend/ ./backend
COPY ./main.py .
COPY ./mitmproxy_reverse_proxy.py .

RUN python -m pip install -r requirements.txt
# Copy the built Next.js application from the builder stage
COPY --from=builder /app ./frontend

# Install production dependencies
RUN cd frontend && npm install --production

# Run a Python command (replace 'your_script.py' with your actual script)
CMD ["python", "main.py", "production"]