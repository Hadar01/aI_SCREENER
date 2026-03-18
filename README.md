# AI-Screener Pro

> **Intelligent Resume Screening powered by AI** — A full-stack MERN application that automates candidate evaluation using LLM-based analysis.

## Architecture

```
ai-screener-pro/
├── server/                          # Express.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection with retry logic
│   ├── controllers/
│   │   └── resumeController.js      # Route handlers (upload, CRUD, stats, CSV)
│   ├── middleware/
│   │   └── upload.js                # Multer config (PDF filter, UUID naming)
│   ├── models/
│   │   └── Resume.js                # Mongoose schema + aggregation pipelines
│   ├── routes/
│   │   └── resumeRoutes.js          # API route definitions
│   ├── services/
│   │   └── aiService.js             # ★ AI prompt engine (Gemini / OpenAI)
│   ├── utils/
│   │   ├── csvExporter.js           # JSON → CSV converter
│   │   └── pdfParser.js             # PDF → text extraction
│   ├── uploads/                     # Stored resume PDFs
│   ├── server.js                    # Express entry point
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
└── client/                          # React Frontend (Stitch-Ready)
    └── src/
        ├── components/
        │   ├── ResumeUploader.jsx    # Drag & drop upload with progress
        │   ├── CandidateCard.jsx     # Individual candidate analysis card
        │   ├── CandidateList.jsx     # Paginated, filterable grid
        │   ├── ScoreBadge.jsx        # Color-coded score indicator
        │   └── StatsPanel.jsx        # Dashboard stats + distribution chart
        ├── hooks/
        │   └── useResumes.js         # TanStack Query hooks for all endpoints
        └── services/
            └── api.js                # Axios client with interceptors
```

## API Endpoints

| Method   | Endpoint                         | Description                          |
| -------- | -------------------------------- | ------------------------------------ |
| `POST`   | `/api/upload`                    | Upload 1-10 PDF resumes + job context|
| `GET`    | `/api/candidates`               | Paginated list with filters & search |
| `GET`    | `/api/candidates/:id`           | Single candidate detail              |
| `DELETE` | `/api/candidates/:id`           | Delete candidate + file              |
| `POST`   | `/api/candidates/:id/reanalyze` | Re-run AI analysis                   |
| `GET`    | `/api/candidates/:id/download`  | Download original PDF                |
| `GET`    | `/api/stats`                    | Dashboard statistics                 |
| `GET`    | `/api/export/csv`               | Export filtered results as CSV       |
| `GET`    | `/api/health`                   | Health check                         |

## Quick Start

### 1. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env → set GEMINI_API_KEY or OPENAI_API_KEY
npm install
npm run dev
```

### 2. Frontend (Stitch Integration)
Import the components from `client/src/components/` into your Stitch project.
Wrap your app with `QueryClientProvider` from `@tanstack/react-query`.

## AI Analysis Output

The AI service returns a structured JSON object for every resume:

```json
{
  "match_score": 78,
  "missing_skills": ["Kubernetes", "GraphQL", "CI/CD"],
  "strengths": ["React expertise", "System design", "Team leadership"],
  "experience_level": "senior",
  "recommendation": "yes",
  "summary": "Strong full-stack developer with 6+ years of experience..."
}
```

## Tech Stack

- **Backend**: Node.js, Express, Mongoose, Multer, pdf-parse
- **AI**: Google Gemini / OpenAI (configurable)
- **Database**: MongoDB
- **Frontend**: React, TanStack Query, Tailwind CSS, Axios
- **Export**: json2csv
