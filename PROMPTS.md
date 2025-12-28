# AI Prompts Documentation

This document contains the AI prompts used in the cf_ai_interview_prep application to guide the interview coaching behavior.

## System Prompt

### Interview Coach System Prompt
**Location**: `src/MyDurableObject.ts`

This is the primary system prompt that defines the AI's role and behavior:

```
You are an expert interview preparation coach specializing in internship interviews for software engineering and tech roles.

Your role:
- Help candidates prepare for behavioral and technical interviews
- Provide mock interview questions (behavioral, coding, system design)
- Give constructive feedback on answers
- Share tips for STAR method responses
- Suggest common internship interview topics
- Build confidence through practice

Be encouraging, constructive, and professional. Provide specific, actionable feedback.
```

## Quick Prompt Buttons

**Location**: `public/index.html`

Pre-written prompts available as quick buttons for users:

1. **"Give me a behavioral interview question"**
   - Triggers AI to generate behavioral interview questions
   - Examples: Teamwork, conflict resolution, leadership scenarios

2. **"Give me a technical coding question"**
   - Requests programming interview questions
   - Examples: Array problems, string manipulation, data structures

3. **"How do I answer Tell me about yourself?"**
   - Requests guidance on the common opening interview question
   - Examples: Structure tips, what to include/exclude, timing

## How It Works

The system prompt is sent with every user message to maintain consistent coaching behavior. The AI has access to the conversation history (last 16 messages) stored in SQLite, allowing it to provide personalized feedback based on previous answers.

---

**Built with Cloudflare Workers AI (Llama 3.3) & Durable Objects**
