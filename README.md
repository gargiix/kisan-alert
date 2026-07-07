# &#x20;





\# 🌾 Kisan Alert



\*\*AI-powered farming advisory platform for smallholder farmers — accessible via simple chat, no smartphone expertise required.\*\*



\[!\[Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://kisan-alert-frontend.vercel.app/)

\[!\[Made with Flask](https://img.shields.io/badge/backend-Flask-000000)](https://flask.palletsprojects.com/)

\[!\[Made with React](https://img.shields.io/badge/frontend-React-61DAFB)](https://react.dev/)

\[!\[Powered by Gemini](https://img.shields.io/badge/AI-Gemini\_2.5\_Flash-4285F4)](https://ai.google.dev/)



\---



\## 📖 Overview



Small farmers make critical seasonal decisions — what to grow, when to irrigate, how to treat crop disease — largely based on habit and word-of-mouth, even though government soil, groundwater, satellite, and weather data already exists to inform better choices. That data rarely reaches farmers in a usable form.



\*\*Kisan Alert\*\* closes that gap by delivering personalized, AI-generated farming advice through a simple conversational interface, designed to eventually work over basic phone calls and SMS — no app, no smartphone, no internet literacy required.



\---



\## 🔗 Live Links



The project is fully deployed and live — the frontend and backend are hosted separately and communicate over a REST API.



\*\*Live Application\*\*

Explore the working chat interface and crop advisory dashboard here:

➡️ https://kisan-alert-frontend.vercel.app/



\*\*Backend API\*\*

The Flask server powering the AI responses, deployed independently on Render:

➡️ https://kisan-alert-backend-rp2f.onrender.com



\*Note: the backend runs on a free-tier server that sleeps after periods of inactivity — the first request after a while may take 20–30 seconds to respond.\*

\---



\## ✨ Features



\### ✅ Implemented



\- \*\*AI Farming Assistant Chat\*\* — Conversational interface powered by Google Gemini 2.5 Flash, tuned to give short, practical, SMS-style advice rather than generic long-form answers

\- \*\*Live Crop Advisory Dashboard\*\* — Dynamically AI-generated crop suggestions (health metrics, growth stage, yield projections) instead of static sample data

\- \*\*Full-stack deployment\*\* — Decoupled frontend/backend architecture, independently deployed and connected via REST API



\### 🔜 Planned



\- \*\*IoT Soil Sensor Integration\*\* — Real-time soil moisture, temperature, and humidity monitoring to trigger proactive irrigation alerts

\- \*\*Photo-Based Crop Diagnosis\*\* — Farmers submit a photo of an affected crop; AI attempts diagnosis, with automatic escalation to the nearest \*\*Rythu Bharosa Kendra\*\* (government farmer help center) when confidence is low

\- \*\*SMS/Voice Call Access Layer\*\* — Removing the need for a smartphone or app entirely



\---



\## 🏗️ Architecture



Farmer (Chat / Future: Call / SMS)

│

▼

┌─────────────────┐

│  React Frontend  │  ← Vite + TypeScript + Tailwind CSS

└────────┬─────────┘

│ REST API

▼

┌─────────────────┐

│  Flask Backend   │  ← Python

└────────┬─────────┘

│

▼

┌─────────────────┐

│  Gemini 2.5 API  │  ← Google Generative AI

└─────────────────┘



\---



\## 🛠️ Tech Stack



| Layer | Technology |

|---|---|

| Frontend | React, TypeScript, Vite, Tailwind CSS |

| Backend | Python, Flask, Flask-CORS |

| AI / LLM | Google Gemini 2.5 Flash API |

| Deployment | Vercel (frontend), Render (backend) |

| Version Control | Git, GitHub |



\---



\## 📁 Project Structure

kisan-alert/

├── frontend/               # React + TypeScript client

│   ├── src/

│   │   └── App.tsx         # Main application component

│   └── package.json

├── backend/                 # Flask API server

│   ├── app.py               # Routes: /chat, /crop-suggestions

│   └── requirements.txt

└── README.md



\---



\## 🚀 Running Locally



\### Prerequisites

\- Python 3.10+

\- Node.js 18+

\- A Google Gemini API key (\[get one here](https://ai.google.dev/))



\### Backend Setup



```bash

cd backend

python -m venv venv

venv\\Scripts\\activate          # Windows

\# source venv/bin/activate     # macOS/Linux



pip install -r requirements.txt

```



Create a `.env` file in `backend/`:

```

GEMINI\_API\_KEY=your\_api\_key\_here

```



Run the server:

```bash

python app.py

```



\### Frontend Setup



```bash

cd frontend

npm install

npm run dev

```



The app will be available at `http://localhost:5173`.



\---



\## 🔌 API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| `GET` | `/ping` | Health check |

| `POST` | `/chat` | Send a farming question, receive AI-generated advice |

| `GET` | `/crop-suggestions` | Get AI-generated crop recommendations |



\---



\## 📌 Roadmap



\- \[ ] IoT soil sensor hardware integration

\- \[ ] Photo-based crop disease diagnosis

\- \[ ] SMS/voice call access via Twilio

\- \[ ] Multi-language support for regional languages

\- \[ ] Integration with government agricultural databases



\---



\## 📄 License



This project was built for educational purposes.

