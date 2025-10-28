
## Production Deployment

I have hosted the frontend on Vercel and Backend on Render, so you can access the platform using: [Live Demo 🚀](https://poll-chat-interface.vercel.app/)

# Full-Stack Application Setup Guide

### If this doesn't work, clone the repository and try the manual approach


This guide will help you set up and run both the backend and frontend of the application.

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher (if using a Node-based frontend)
- pip (Python package manager)

## Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a Python virtual environment

```bash
python -m venv venv
```

or on some systems:

```bash
python3 -m venv venv
```

### 3. Activate the virtual environment

**On Windows:**
```bash
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install required packages

```bash
pip install -r requirements.txt
```

### 5. Run the backend server

```bash
python3 main.py
```

or depending on your setup:

The backend should now be running on `http://localhost:8000` (or the port specified in your configuration).

## Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Create a `.env` file

Create a `.env` file in the frontend directory:


**Note:** If your framework uses a different environment variable prefix (like `VITE_` for Vite), adjust accordingly:

```env
VITE_BACKEND_URL=http://localhost:8000
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the frontend development server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173/` (default for most frameworks).

## Project Structure

```
.
├── backend/
│   ├── venv/
│   ├── requirements.txt
│   └── app.py
└── frontend/
    ├── .env
    ├── package.json
    └── src/
```

## Additional Notes

- Always activate the virtual environment before working on the backend