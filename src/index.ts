import { MyDurableObject } from './MyDurableObject';

export { MyDurableObject };

interface Env {
	MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
	AI: Ai;
	ASSETS: Fetcher;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle POST /api/chat
		if (url.pathname === '/api/chat' && request.method === 'POST') {
			try {
				// Parse and validate input
				const body = await request.json<{ sessionId?: string; message?: string }>();

				if (!body.sessionId || typeof body.sessionId !== 'string') {
					return new Response(
						JSON.stringify({ error: 'Missing or invalid sessionId' }),
						{ status: 400, headers: { 'Content-Type': 'application/json' } }
					);
				}

				if (!body.message || typeof body.message !== 'string') {
					return new Response(
						JSON.stringify({ error: 'Missing or invalid message' }),
						{ status: 400, headers: { 'Content-Type': 'application/json' } }
					);
				}

				// Get Durable Object instance by sessionId
				const id = env.MY_DURABLE_OBJECT.idFromName(body.sessionId);
				const stub = env.MY_DURABLE_OBJECT.get(id);

				// Call chat method
				const result = await stub.chat(body.message);

				return new Response(JSON.stringify(result), {
					headers: { 'Content-Type': 'application/json' },
				});
			} catch (error) {
				console.error('Error handling chat request:', error);
				return new Response(
					JSON.stringify({ 
						error: 'Invalid request',
						details: error instanceof Error ? error.message : String(error)
					}),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}
		}

		// Serve static assets
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
