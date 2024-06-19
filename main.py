import subprocess
import os
import logging
from threading import Thread
import argparse

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def install_dependencies():
    logger.info("Installing dependencies for FastAPI back-end")
    subprocess.check_call(["pip", "install", "-r", "backend/requirements.txt"])
    logger.info("Dependencies installed for FastAPI back-end")

    logger.info("Installing dependencies for Next.js front-end")
    subprocess.check_call(["npm", "install"], cwd="frontend")
    logger.info("Dependencies installed for Next.js front-end")

def stream_logs(pipe, log_function):
    for line in iter(pipe.readline, b''):
        log_function(line.decode().strip())
    pipe.close()

def start_servers(env):
    # Define paths
    backend_dir = os.path.join(os.getcwd(), 'backend')
    frontend_dir = os.path.join(os.getcwd(), 'frontend')

    # Start FastAPI server
    backend_command = f"uvicorn api:app --reload" if env == "development" else f"uvicorn api:app --host 0.0.0.0 --port 80"
    # Start Next.js server
    frontend_command = f"npm run dev" if env == "development" else f"npm run build && npm run start"

    # Log the commands being run
    logger.info("Starting FastAPI server with command: %s", backend_command)
    logger.info("Starting Next.js server with command: %s", frontend_command)

    # Run both commands
    backend_process = subprocess.Popen(backend_command, cwd=backend_dir, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    frontend_process = subprocess.Popen(frontend_command, cwd=frontend_dir, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Stream logs for backend
    Thread(target=stream_logs, args=(backend_process.stdout, logger.info)).start()
    Thread(target=stream_logs, args=(backend_process.stderr, logger.error)).start()
    # Stream logs for frontend
    Thread(target=stream_logs, args=(frontend_process.stdout, logger.info)).start()
    Thread(target=stream_logs, args=(frontend_process.stderr, logger.error)).start()

    # Wait for both processes to complete
    backend_process.wait()
    frontend_process.wait()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start FastAPI and Next.js servers.")
    parser.add_argument("mode", choices=["development", "production"], help="Run mode")
    parser.add_argument("--install", action="store_true", help="Install dependencies")
    args = parser.parse_args()

    if args.install:
        install_dependencies()

    logger.info("Starting both FastAPI and Next.js servers in %s mode", args.mode)
    start_servers(args.mode)
    logger.info("Both servers have been started in %s mode", args.mode)