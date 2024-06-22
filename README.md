# Confidant

Soverant application

## Features

- under construction

## Requirements

- Python 3.8+
- Node.js 12+

## Installation

### Clone the Repository

```bash
git clone https://github.com/git@github.com:soverant/confidant.git
cd confidant
```

### Set Up Python Environment

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```
2. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

### Install Dependencies

You can install all dependencies for both the back-end and front-end using the `main.py` script.

```bash
python main.py development --install
```

Alternatively, you can install dependencies manually:

#### Back-end (FastAPI)

```bash
pip install -r backend/requirements.txt
```

#### Front-end (Next.js)

```bash
cd frontend
npm install
```

## Running the Application

You can run the application in either development or production mode using the `main.py` script.

### Development Mode

```bash
python main.py development
```

### Production Mode

```bash
python main.py production
```

## Logging

The application streams logs from both the FastAPI back-end and the Next.js front-end to the console using the Python logging module.

## Project Structure

```
your-project-name/
├── backend/
│   ├── api.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── node_modules/
│   ├── package.json
│   └── ...
├── main.py
├── venv/
└── ...
```

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/)
