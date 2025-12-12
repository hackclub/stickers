import { env } from '$env/dynamic/private';

const backend = env.BACKEND_URL || 'http://localhost:9292';

async function proxy({ request, params, cookies }: { request: Request; params: { path: string }; cookies: any }) {
	const path = params.path || '';
	const url = new URL(request.url);
	const targetUrl = `${backend}/${path}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');

	const cookie = cookies.get('stickers.session');
	if (cookie) {
		headers.set('cookie', `stickers.session=${cookie}`);
	}

	const res = await fetch(targetUrl, {
		method: request.method,
		headers,
		body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined
	});

	const responseHeaders = new Headers(res.headers);
	responseHeaders.delete('transfer-encoding');

	const setCookie = res.headers.get('set-cookie');
	if (setCookie) {
		responseHeaders.set('set-cookie', setCookie);
	}

	return new Response(res.body, {
		status: res.status,
		headers: responseHeaders
	});
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
