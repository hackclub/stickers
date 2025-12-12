import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

const backend = env.BACKEND_URL || 'http://localhost:9292';

async function proxy({ request, params, cookies }: { request: Request; params: { path: string }; cookies: any }) {
	const path = params.path || '';
	const url = new URL(request.url);
	const targetUrl = `${backend}/auth/${path}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete('host');

	const cookie = cookies.get('stickers.session');
	if (cookie) {
		headers.set('cookie', `stickers.session=${cookie}`);
	}

	const res = await fetch(targetUrl, {
		method: request.method,
		headers,
		body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
		redirect: 'manual'
	});

	const setCookie = res.headers.get('set-cookie');
	if (setCookie) {
		const match = setCookie.match(/stickers\.session=([^;]+)/);
		if (match) {
			cookies.set('stickers.session', match[1], { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 86400 * 7 });
		}
	}

	if (res.status >= 300 && res.status < 400) {
		const location = res.headers.get('location');
		if (location) {
			throw redirect(res.status as 301 | 302 | 303 | 307 | 308, location);
		}
	}

	const responseHeaders = new Headers(res.headers);
	responseHeaders.delete('transfer-encoding');
	responseHeaders.delete('set-cookie');

	return new Response(res.body, {
		status: res.status,
		headers: responseHeaders
	});
}

export const GET = proxy;
export const POST = proxy;
