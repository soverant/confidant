import subprocess
import os
import logging
from threading import Thread
import argparse
import signal
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(message)s')

# Create separate loggers for backend and frontend
backend_logger = logging.getLogger("backend")
frontend_logger = logging.getLogger("frontend")
cli_logger = logging.getLogger("cli")


def install_dependencies():
    backend_logger.info("Installing dependencies for FastAPI back-end")
    subprocess.check_call(["pip", "install", "-r", "backend/requirements.txt"])
    backend_logger.info("Dependencies installed for FastAPI back-end")

    frontend_logger.info("Installing dependencies for Next.js front-end")
    subprocess.check_call(["npm", "install"], cwd="frontend")
    frontend_logger.info("Dependencies installed for Next.js front-end")


def stream_logs(pipe, logger, ):
    for line in iter(pipe.readline, b''):
        logger.info(f"{line.decode().strip()}")
    pipe.close()


def start_servers(env):
    # Define paths
    backend_dir = os.path.join(os.getcwd(), 'backend')
    frontend_dir = os.path.join(os.getcwd(), 'frontend')

    # Start FastAPI server
    backend_command = f"uvicorn main:app --reload" if env == "development" else f"uvicorn main:app --host 0.0.0.0 --port 80"
    # Start Next.js server
    frontend_command = f"npm run dev" if env == "development" else f"npm run build && npm run start"

    # Log the commands being run
    backend_logger.info("Starting FastAPI server with command: %s", backend_command)
    frontend_logger.info("Starting Next.js server with command: %s", frontend_command)

    # Run both commands
    backend_process = subprocess.Popen(backend_command, cwd=backend_dir, shell=True, stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE)
    frontend_process = subprocess.Popen(frontend_command, cwd=frontend_dir, shell=True, stdout=subprocess.PIPE,
                                        stderr=subprocess.PIPE)

    def shutdown(signum, frame):
        backend_logger.info("Shutting down servers...")
        frontend_logger.info("Shutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_logger.info("Servers shut down gracefully")
        frontend_logger.info("Servers shut down gracefully")
        sys.exit(0)

    # Register the signal handler for graceful shutdown
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    # Stream logs for backend
    Thread(target=stream_logs, args=(backend_process.stdout, backend_logger)).start()
    Thread(target=stream_logs, args=(backend_process.stderr, backend_logger)).start()
    # Stream logs for frontend
    Thread(target=stream_logs, args=(frontend_process.stdout, frontend_logger)).start()
    Thread(target=stream_logs, args=(frontend_process.stderr, frontend_logger)).start()

    # Wait for both processes to complete
    backend_process.wait()
    frontend_process.wait()


if __name__ == "__main__":
    openapi_spec_path = "./backend/openapi.json"
    output_directory = "./frontend/src/app/lib/generated-client"
    parser = argparse.ArgumentParser(description="Start FastAPI and Next.js servers.")
    parser.add_argument("mode", choices=["development", "production", "generation"], help="Run mode")
    parser.add_argument("--install", action="store_true", help="Install dependencies")
    args = parser.parse_args()

    if args.install:
        install_dependencies()

    print(args.mode)
    if args.mode == "generation":
        sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/backend/")
        import json
        from fastapi import FastAPI
        from backend.main import app

        cli_logger.info("creating openapi_schema ...")
        openapi_schema = app.openapi()
        with open(openapi_spec_path, "w") as openapi_file:
            json.dump(openapi_schema, openapi_file, indent=2)
        cli_logger.info("creating openapi_schema done")
        # Remove the old generated client if it exists
        if os.path.exists(output_directory):
            subprocess.run(["rm", "-rf", output_directory])
        cli_logger.info("old client cleaned up")
        # Generate the TypeScript client using openapi-generator-cli
        cli_logger.info("generating client ...")
        result = subprocess.run(
            [
                "npx",
                "--yes",
                "@hey-api/openapi-ts",
                "-i", openapi_spec_path,
                "-o", output_directory
            ],
            capture_output=True,
            text=True
        )
        logging.info("generator output:\n%s", result.stdout)
    else:
        backend_logger.info("Starting both FastAPI and Next.js servers in %s mode", args.mode)
        frontend_logger.info("Starting both FastAPI and Next.js servers in %s mode", args.mode)
        start_servers(args.mode)
        backend_logger.info("Both servers have been started in %s mode", args.mode)
        frontend_logger.info("Both servers have been started in %s mode", args.mode)
