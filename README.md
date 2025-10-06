# Eromify - AI Influencer Generator SaaS

A powerful SaaS platform that generates AI-powered influencer content and profiles.

## Features

- 🤖 AI-powered content generation
- 👤 Influencer profile creation
- 📊 Analytics dashboard
- 💳 Subscription management
- 🔐 Secure authentication
- 🎨 Modern, responsive UI

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` directories
   - Fill in your Supabase and OpenAI credentials

4. Start development servers:
   ```bash
   npm run dev
   ```

This will start both the backend (port 3001) and frontend (port 5173) servers.

## Project Structure

```
eromify/
├── backend/          # Express.js API server
├── frontend/         # React frontend application
├── shared/           # Shared utilities and types
└── docs/            # Documentation
```

## Development

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:5173
- Supabase Dashboard: https://supabase.com/dashboard

## License

MIT



