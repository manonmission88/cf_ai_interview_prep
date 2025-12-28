# AI Prompts Documentation

This document contains all AI prompts used in the cf_ai_interview_prep application, as required by the Cloudflare internship assignment.

## System Prompts

### Interview Coach System Prompt
**Location**: `src/MyDurableObject.ts` (Line ~50)

**Purpose**: Sets the AI's role and behavior for the entire application

**Prompt**:
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

**Rationale**: 
- Establishes clear expertise domain (interview prep for tech internships)
- Defines specific capabilities (questions, feedback, STAR method)
- Sets tone (encouraging, constructive, professional)
- Ensures responses are actionable and helpful for interview preparation

## User-Facing Prompts

### Quick Prompt Buttons
**Location**: `public/index.html` (Lines ~200-202)

These pre-written prompts help users quickly engage with common interview prep scenarios:

1. **"Give me a behavioral interview question"**
   - Triggers AI to generate STAR-method style behavioral questions
   - Common response: Teamwork, conflict resolution, leadership scenarios

2. **"Give me a technical coding question"**
   - Requests programming interview questions
   - Common response: Array problems, string manipulation, data structures

3. **"How do I answer 'Tell me about yourself'?"**
   - Requests guidance on common interview question
   - Common response: Structure, what to include/exclude, timing tips

### Welcome Message
**Location**: `public/index.html` (Lines ~185-195)

**Prompt**:
```
👋 Hi! I'm your AI interview coach. I can help you prepare for internship interviews with:

• Mock interview questions (behavioral & technical)
• Feedback on your answers
• STAR method guidance
• Common interview tips

How can I help you prepare today?
```

**Purpose**: Introduces capabilities and sets user expectations

## Prompt Engineering Techniques Used

### 1. Role Definition
- Clearly defines AI as "expert interview preparation coach"
- Specifies target audience (internship candidates for tech roles)

### 2. Capability Scoping
- Lists specific tasks AI can perform
- Prevents scope creep and irrelevant responses

### 3. Tone Setting
- "Encouraging, constructive, and professional"
- Ensures supportive learning environment

### 4. Output Format Guidance
- "Provide specific, actionable feedback"
- "Share tips for STAR method responses"
- Ensures responses are practical and structured

### 5. Context Maintenance
- System prompt included with every AI call
- Last 16 messages loaded from SQLite for conversation context
- Enables coherent multi-turn conversations

## Message Structure Sent to Workers AI

**Location**: `src/MyDurableObject.ts` (Line ~56)

```typescript
const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
  messages: [systemPrompt, ...messages],
});
```

**Format**:
```javascript
[
  {
    role: 'system',
    content: '<Interview Coach System Prompt>'
  },
  {
    role: 'user',
    content: 'Give me a behavioral interview question'
  },
  {
    role: 'assistant',
    content: 'Here\'s a common behavioral question...'
  },
  // ... up to 16 recent messages
]
```

## Example Conversation Flow

### Turn 1
**User Input**: "Give me a behavioral interview question"

**Messages Sent to AI**:
- System prompt (interview coach role)
- User message

**AI Response**:
```
Here's a common behavioral question: "Tell me about a time when you had to work 
with a difficult team member. How did you handle it?"

When answering, use the STAR method:
• Situation: Set the context
• Task: Describe your responsibility  
• Action: Explain what you did
• Result: Share the outcome
```

### Turn 2
**User Input**: "How about a coding question?"

**Messages Sent to AI**:
- System prompt
- Previous user message ("Give me a behavioral...")
- Previous AI response
- Current user message

**AI Response**:
```
Great! Here's a classic coding question:

"Given an array of integers, find two numbers that add up to a specific target."

Try to solve it, then I can help with hints or discuss optimal approaches!
```

## Prompt Optimization Considerations

### Why Llama 3.3 70B?
- Large parameter count (70B) provides better reasoning
- fp8-fast variant balances quality with latency
- Ideal for interview coaching requiring nuanced responses

### Context Window Management
- Limited to 16 most recent messages
- Prevents token limit issues
- Maintains relevant recent context
- Balances memory with performance

### System Prompt Position
- Always first in message array
- Ensures consistent behavior across all responses
- Reinforces role even in long conversations

## AI-Assisted Development Prompts

### Initial Project Setup
```
Build a minimal Cloudflare Workers AI chat application for a job application.

Requirements:
- Worker entry at src/index.ts
- Durable Object at src/MyDurableObject.ts
- Use Workers AI with Llama 3.3
- Store chat memory/state in a Durable Object using SQLite
- Expose POST /api/chat endpoint
...
```

### Enhancement for Interview Prep
```
Can you make this work for interview prep for internships?

Optional Assignment Instructions: We plan to fast track review of candidates who 
complete an assignment to build a type of AI-powered application on Cloudflare...
```

### Frontend Development
```
Create a simple HTML/JS interface for chat interaction with:
- Clean, modern UI
- Real-time messaging
- Quick prompt buttons
- Session management
```

## Lessons Learned

1. **Specificity Matters**: The more specific the system prompt, the better the responses
2. **Context is Key**: Including conversation history dramatically improves coherence
3. **Quick Prompts Help**: Pre-written prompts guide users and showcase capabilities
4. **Tone Setting Works**: Explicitly requesting "encouraging" responses improves user experience
5. **Scoping Prevents Drift**: Clear capability boundaries keep AI focused on interview prep

## Future Prompt Improvements

1. Add few-shot examples for better question generation
2. Include specific interview formats (FAANG, startup, etc.)
3. Add prompt for feedback scoring (1-10 scale)
4. Include industry-specific technical topics
5. Add meta-prompts for interview strategy discussions

---

**Note**: All prompts in this document reflect the actual implementation in the codebase as of the last commit.
