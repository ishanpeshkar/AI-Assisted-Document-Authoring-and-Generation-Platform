# OceanAI - AI-Assisted Document Authoring Platform

OceanAI is a full-stack web application that allows users to generate, refine, and export structured business documents (Word & PowerPoint) using the Google Gemini API.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Project Management**: Create and manage multiple document projects.
- **Document Scaffolding**: Define structure for Word documents (sections) and PowerPoint presentations (slides).
- **AI Content Generation**: Generate high-quality content using Google Gemini (gemini-2.0-flash).
- **Interactive Refinement**: Refine specific sections with natural language prompts.
- **Export**: Download your projects as formatted `.docx` or `.pptx` files.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, python-docx, python-pptx, Google Generative AI
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file in the `backend` directory and add your API keys:
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

## Usage

1. Register for a new account.
2. Click "New Project" to start.
3. Select "Word Document" or "PowerPoint Presentation".
4. Enter a title and a main topic/prompt.
5. Define the structure (sections or slides).
6. Click "Create Project".
7. In the Editor, click "Generate Content" to have AI fill in the sections.
8. Use the input box at the bottom of each section to refine the content (e.g., "Make it shorter").
9. Click "Export" to download the final file.