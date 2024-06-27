# Stage 1: Build Next.js application
ARG API_BASE_URL=https://soverant.darkube.app

# Stage 2: Final stage with Node.js, npm, and Python 3.9
FROM node:18


# Install Python 3.9 and other dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv mitmproxy && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
 
RUN pip install mitmproxy

COPY ./backend/ ./backend
COPY ./main.py .
COPY ./mitmproxy_reverse_proxy.py .

RUN python -m pip install -r ./backend/requirements.txt && \
    mkdir ./backend/data

VOLUME ./backend/data    

# Install dependencies
COPY ./frontend/package*.json ./
RUN cd frontend && npm install

# Copy the rest of the application source code
COPY ./frontend/ .
ENV NEXT_PUBLIC_API_BASE_URL #{API_BASE_URL}
# Build the Next.js application
RUN cd frontend && npm run build


# Run a Python command (replace 'your_script.py' with your actual script)
CMD ["python", "main.py", "production"]