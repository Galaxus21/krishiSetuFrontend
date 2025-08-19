KrishiSetu 🌾 - Your Autonomous One Stop Sales Agent
KrishiSetu is a modern, AI-powered web application that provides Indian farmers with an autonomous sales agent to navigate complex agricultural markets. By automating the entire sales process—from finding buyers to optimizing prices—KrishiSetu acts as a digital bridge (Setu) that empowers farmers to maximize their profitability with minimal effort.

Designed for India's rich linguistic diversity, the platform features a multilingual, voice-first interface, ensuring that every farmer can access its powerful tools in their native language. While the platform also includes a powerful AI assistant for crop advice and disease detection, its core innovation is the proactive, 24/7 agent that works tirelessly on the farmer's behalf.

✨ Features
The application is built around a powerful, autonomous agent, supported by a suite of AI-driven advisory tools.

📈 Proactive Sales Agent (Mandi) - Core Feature
This is the heart of KrishiSetu. The autonomous agent is designed to take over the complex and time-consuming task of selling produce, allowing farmers to focus on farming.

Autonomous Opportunity Discovery: The agent continuously scans B2B marketplaces for relevant buyer requests (RFQs) that match the farmer's specific commodity and quality grade.

Intelligent Price Optimization: It doesn't just find buyers; it finds the best deal. The agent analyzes real-time market data, buyer ratings, and order urgency to calculate a "smart price" designed to maximize the farmer's profit.

Automated Quote Submission: Speed is critical in a competitive market. The agent instantly responds to new opportunities by submitting a professionally crafted quote on the farmer's behalf, ensuring they are always first in line.

24/7 Monitoring: The agent never sleeps. It works around the clock to find opportunities and will immediately alert the farmer via the app when a buyer responds or a deal is secured.

🤖 AI Assistant (Supporting Features)
To support the farmer's core operations, the platform also includes a multi-functional chat interface designed for inclusivity.

Multilingual Voice-First Advisory: Overcoming literacy and digital barriers, farmers can ask questions and receive advice simply by speaking to their phone in their native language.

General Advice: Get instant answers to farming-related questions, from weather patterns to market prices, in multiple Indian languages.

Disease Detector: Upload an image of a plant and describe the issue in your local dialect to get a quick AI-powered diagnosis and recommended actions.

Financial Advisor: Get data-driven financial advice. This RAG-based agent uses a knowledge base of financial schemes to provide detailed proposals for goals like securing a tractor loan, tailored to the farmer's specific state.

🛠️ Tech Stack
This project is built with a modern, scalable, and efficient technology stack, with a strong emphasis on agentic AI frameworks and multilingual capabilities.

Frontend
Framework: React

Build Tool: Vite

Language: TypeScript

State Management: Redux

Internationalization: i18next

UI Library: Ant Design

Styling: Aphrodite

API Communication: Axios

Backend
Framework: FastAPI

Agent Framework: LangChain (for the core proactive sales agent)

AI/ML: Google Gemini, Dhenu 2, Natural Language Processing (NLP), Speech-to-Text/Text-to-Speech

Deployment: Google Cloud Run

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
Node.js (version 18.x or higher recommended)

npm or yarn

Installation
Clone the repository:

git clone https://github.com/your-username/krishiSetuFrontend.git
cd krishiSetuFrontend

Install dependencies:

npm install

Environment Variables
To connect the frontend to your backend services, you need to create an environment file.

In the root of your project, create a file named .env.

Add your backend API URLs to this file. Vite requires environment variables exposed to the browser to be prefixed with VITE_.

VITE_BACKEND_API_KEY="https://krishisetu2-961717481370.asia-south2.run.app"
VITE_BACKEND_FINANCE_API_KEY="https://krishisetufinadvisor-961717481370.asia-south2.run.app"

Running the Development Server
Start the Vite development server. By default, the application will be available at http://localhost:5173.

npm run dev

Note on CORS: For the local development server to communicate with your backend, ensure the backend's CORS configuration allows your localhost URL (e.g., "http://localhost:5173").

☁️ Deployment
This application is configured for easy deployment using Firebase Hosting.

Prerequisites
You must have the Firebase CLI installed: npm install -g firebase-tools

You must be logged in to Firebase: firebase login

Deployment Steps
Initialize Firebase (if you haven't already):

firebase init hosting

When prompted for the public directory, enter dist.

When asked to configure as a single-page app, answer Yes.

Build the application for production:

npm run build

This command creates an optimized production build in the dist folder.

Deploy to Firebase Hosting:

firebase deploy

After deployment, the CLI will provide you with the live URL for your project.

🔗 Backend Repository
The backend for this project consists of separate FastAPI applications. You can find the repositories here:

Main Service: KrishiSetu Backend Repo (replace URL)

Financial Advisor: KrishiSetu Finance Backend Repo (replace URL)