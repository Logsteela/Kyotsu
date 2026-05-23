const R2_HOST = 'pub-43d2006e555442dca4a107e7bc0d01bb.r2.dev';

function getFileNameFromUrl(url: URL): string {
  const fileName = url.pathname.split('/').filter(Boolean).pop();
  return fileName ? decodeURIComponent(fileName) : 'download';
}

function getContentDisposition(fileName: string): string {
  const fallback = fileName
    .replace(/[^\x20-\x7E]+/g, '_')
    .replace(/["\\]/g, '_') || 'download';

  const encoded = encodeURIComponent(fileName)
    .replace(/['()]/g, escape)
    .replace(/\*/g, '%2A');

  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export async function onRequestGet(context: { request: Request }) {
  const requestUrl = new URL(context.request.url);
  const rawUrl = requestUrl.searchParams.get('url');
  const rawName = requestUrl.searchParams.get('name');

  if (!rawUrl) {
    return new Response('Missing url', { status: 400 });
  }

  let targetUrl: URL;

  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }

  if (targetUrl.protocol !== 'https:' || targetUrl.hostname !== R2_HOST) {
    return new Response('Invalid target', { status: 400 });
  }

  const upstream = await fetch(targetUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: '*/*',
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Download source not found', {
      status: upstream.status || 502,
    });
  }

  const fileName = rawName?.trim() || getFileNameFromUrl(targetUrl);
  const headers = new Headers();

  headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/octet-stream');
  headers.set('Content-Disposition', getContentDisposition(fileName));
  headers.set('Cache-Control', 'public, max-age=3600');
  headers.set('X-Content-Type-Options', 'nosniff');

  const contentLength = upstream.headers.get('Content-Length');
  if (contentLength) headers.set('Content-Length', contentLength);

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
