# cf_ai_interview_prep

> AI-Powered Interview Preparation Coach for Tech Internships

A complete interview preparation application built on Cloudflare's edge platform, featuring Workers AI (Llama 3.3), Durable Objects with SQLite, and real-time chat interface.

## Features

- **LLM Integration**: Powered by Llama 3.3 (70B) on Cloudflare Workers AI
- **Persistent Memory**: Session-based conversation history stored in Durable Objects with SQLite
- **Interview-Specific Coaching**: 
  - Mock behavioral interview questions
  - Technical coding questions
  - STAR method guidance
  - Personalized feedback on answers
- **Real-time Chat Interface**: Clean, responsive web UI for seamless interaction
- **Session Management**: Maintains context across multiple conversations

## Architecture

```
┌─────────────────┐
│   Chat UI       │ (Static Assets)
│  (index.html)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Worker          │ (src/index.ts)
│ (POST /api/chat)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Durable Object  │ (src/MyDurableObject.ts)
│ - SQLite Storage│ • Stores conversation history
│ - Workers AI    │ • Calls Llama 3.3 model
│                 │ • Manages session state
└─────────────────┘
```

### Components

1. **Worker Entry Point** ([src/index.ts](src/index.ts))
   - Routes `/api/chat` requests
   - Validates input (sessionId, message)
   - Creates Durable Object instances per session
   - Serves static frontend

2. **Durable Object** ([src/MyDurableObject.ts](src/MyDurableObject.ts))
   - SQLite table for message persistence
   - Loads last 16 messages for context
   - Calls Workers AI with interview-focused system prompt
   - Returns AI responses

3. **Frontend** ([public/index.html](public/index.html))
   - Vanilla HTML/CSS/JavaScript
   - Real-time chat interface
   - Quick prompt suggestions
   - Session management with localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cf_ai_interview_prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser: http://localhost:8787
   - Chat interface will load automatically
   - Or test API directly:
   ```bash
   curl -X POST http://localhost:8787/api/chat \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "test123", "message": "Give me a behavioral question"}'
   ```

### Deployment

1. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

2. **Deploy to production**
   ```bash
   npm run deploy
   ```

3. **Access your deployed app**
   - Visit: `https://cf-ai-agent.<your-subdomain>.workers.dev`
   - Deployed App : `https://cf-ai-agent.niuremanish88.workers.dev`
   - 

## API Reference

### POST /api/chat

Send a message and receive AI response.

**Request:**
```json
{
  "sessionId": "string",  // Unique identifier for conversation
  "message": "string"     // User's message
}
```

**Response:**
```json
{
  "reply": "string"       // AI assistant's response
}
```

**Example:**
```bash
curl -X POST https://your-worker.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user_456",
    "message": "How should I prepare for a Google internship interview?"
  }'
```

## Example Interactions

**Behavioral Questions:**
```
User: Give me a behavioral interview question
AI: Here's a common behavioral question: "Tell me about a time when you 
    had to work with a difficult team member. How did you handle it?"
    
    When answering, use the STAR method:
    • Situation: Set the context
    • Task: Describe your responsibility
    • Action: Explain what you did
    • Result: Share the outcome
```

**Technical Prep:**
```
User: Give me a coding question for arrays
AI: Great! Here's a classic array problem:
    
    "Given an array of integers, find two numbers that add up to a specific 
    target. Return the indices of these two numbers."
    
    Try to solve it first, then I can provide hints or discuss the optimal 
    approach (hint: think about hash maps).
```

## Technology Stack

- **Runtime**: Cloudflare Workers
- **AI Model**: Llama 3.3 70B (fp8-fast) via Workers AI
- **State Management**: Durable Objects with SQLite
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **TypeScript**: Full type safety
- **Build Tool**: Wrangler

## Project Structure

```
cf_ai_interview_prep/
├── src/
│   ├── index.ts              # Worker entry point & routing
│   └── MyDurableObject.ts    # Durable Object with SQLite & AI
├── public/
│   └── index.html            # Chat UI frontend
├── test/
│   └── index.spec.ts         # Tests
├── wrangler.jsonc            # Cloudflare Worker config
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── README.md                 # This file
└── PROMPTS.md                # AI prompts documentation
```

## Privacy & Data

- All conversations are stored in your Cloudflare Durable Objects
- SessionIDs are generated client-side and stored in localStorage
- No authentication required (for demo purposes)
- Each session is isolated and maintains independent conversation history

## Use Cases

- Practice for FAANG internship interviews
- Prepare behavioral interview answers
- Review common technical questions
- Get feedback on interview responses
- Learn STAR method for behavioral questions
- Build confidence before actual interviews

## Learn More

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Llama 3.3 Model](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/)




**Built with using Cloudflare Workers AI**
