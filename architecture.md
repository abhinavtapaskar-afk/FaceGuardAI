FaceGuard AI – Architecture Blueprint
1. Frontend (User Interface)

Location: frontend/

Includes:

Signup/Login screens

Face Scan screen

Diagnosis result screen

Product recommendations page

Diet/Vitamins page

Lifestyle suggestions page

Weekly progress dashboard

Dark/Light skin-friendly UI

Built using:

React + Tailwind OR HTML/CSS/JS

Camera access (for scanning)

Charts for progress

Form for questionnaire

2. Backend (API + Logic)

Location: backend/

Functions:

Receive selfie from user

Send selfie to AI Engine

Save user skin data

Save weekly tracking history

Handle login + authentication

Store routines and products

Built using:

Node.js / Express OR Python FastAPI

Supabase or Firebase database

3. AI Engine (Core Brain)

Location: ai_engine/

Modules:

Skin type detection

Acne grading

Pigmentation detection

Texture analysis

Under-eye detection

Product recommendation engine

Diet & vitamin engine

Lifestyle engine

Safety rule engine (ingredient conflicts)

AI models used:

OpenAI Vision

Google Cloud Vision API

Custom rule-based systems

4. Config File

Location: config.env

Stores:

OpenAI API key

Vision API key

Database keys

5. App Root

Location: app.js

Main function:

Start the server

Connect frontend + backend

Load AI engine

Handle routes

Serve the app

Your task (AI agent):

Use this architecture to generate all code files automatically across the correct folders.

End of file
