import { DurableObject } from 'cloudflare:workers';

interface Message {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export class MyDurableObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.env = env;
	}

	async chat(message: string): Promise<{ reply: string }> {
		// Initialize SQLite table
		this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS messages (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				role TEXT NOT NULL,
				content TEXT NOT NULL,
				ts INTEGER NOT NULL
			)
		`);

		// Store user message
		this.ctx.storage.sql.exec(
			`INSERT INTO messages (role, content, ts) VALUES (?, ?, ?)`,
			'user',
			message,
			Date.now()
		);

		// Load recent messages (limit 16 for context)
		const cursor = this.ctx.storage.sql.exec(
			`SELECT role, content FROM messages ORDER BY id DESC LIMIT 16`
		);

		const messages: Message[] = [];
		for (const row of cursor) {
			messages.unshift({
				role: row.role as 'user' | 'assistant',
				content: row.content as string,
			});
		}

		// Add interview prep system prompt
		const systemPrompt: Message = {
			role: 'system',
			content: `You are an expert interview preparation coach specializing in internship interviews for software engineering and tech roles.

Your role:
- Help candidates prepare for behavioral and technical interviews
- Provide mock interview questions (behavioral, coding, system design)
- Give constructive feedback on answers
- Share tips for STAR method responses
- Suggest common internship interview topics
- Build confidence through practice

Be encouraging, constructive, and professional. Provide specific, actionable feedback.`,
		};

		// Call Workers AI
		const env = this.env as { AI: Ai };
		const response = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
			messages: [systemPrompt, ...messages],
		}) as { response: string };

		const reply = response.response || 'No response generated.';

		// Store assistant message
		this.ctx.storage.sql.exec(
			`INSERT INTO messages (role, content, ts) VALUES (?, ?, ?)`,
			'assistant',
			reply,
			Date.now()
		);

		return { reply };
	}
}
