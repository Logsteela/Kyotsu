type VercelRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  on?: (event: string, callback: (chunk?: unknown) => void) => void;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

type ClickAction = 'view' | 'download' | 'audioView' | 'audioDownload' | 'copy' | 'unknown';

type ClickPayload = {
  action?: unknown;
  target?: unknown;
  path?: unknown;
  page?: unknown;
};

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY_TOTAL = 'kyotsu:clicks:total';
const KEY_ACTIONS = 'kyotsu:clicks:actions';
const KEY_TARGETS = 'kyotsu:clicks:targets';
const KEY_DATES = 'kyotsu:clicks:dates';
const KEY_RECENT = 'kyotsu:clicks:recent';

function setNoStore(response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
}

function normalizeAction(value: unknown): ClickAction {
  if (
    value === 'view' ||
    value === 'download' ||
    value === 'audioView' ||
    value === 'audioDownload' ||
    value === 'copy'
  ) {
    return value;
  }

  return 'unknown';
}

function normalizeTarget(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return 'unknown';

  try {
    const url = new URL(raw, 'https://kyotsutest.vercel.app');
    const normalized = `${url.pathname}${url.search}`.replace(/\/+$/, '');
    return decodeURIComponent(normalized || '/').slice(0, 500);
  } catch {
    return raw.replace(/#.*$/, '').slice(0, 500);
  }
}

function normalizePage(value: unknown): string {
  const raw = String(value ?? '').trim();
  if (!raw) return 'unknown';
  return raw.slice(0, 200);
}

async function readPayload(request: VercelRequest): Promise<ClickPayload> {
  if (request.body && typeof request.body === 'object') {
    return request.body as ClickPayload;
  }

  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body) as ClickPayload;
    } catch {
      return {};
    }
  }

  const raw = await new Promise<string>((resolve) => {
    if (typeof request.on !== 'function') {
      resolve('');
      return;
    }

    let body = '';

    request.on('data', (chunk?: unknown) => {
      body += String(chunk ?? '');
    });

    request.on('end', () => resolve(body));
    request.on('error', () => resolve(''));
  });

  if (!raw) return {};

  try {
    return JSON.parse(raw) as ClickPayload;
  } catch {
    return {};
  }
}

async function redisPipeline(commands: string[][]): Promise<unknown> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error('storage_not_configured');
  }

  const endpoint = `${REDIS_URL.replace(/\/+$/, '')}/pipeline`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    throw new Error(`redis_${response.status}`);
  }

  return response.json();
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  setNoStore(response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const payload = await readPayload(request);
  const action = normalizeAction(payload.action);
  const target = normalizeTarget(payload.target ?? payload.path);
  const page = normalizePage(payload.page);
  const at = new Date();
  const day = at.toISOString().slice(0, 10);

  if (!REDIS_URL || !REDIS_TOKEN) {
    response.status(202).json({ ok: true, saved: false, reason: 'storage_not_configured' });
    return;
  }

  const recent = JSON.stringify({
    at: at.toISOString(),
    action,
    target,
    page,
  });

  try {
    await redisPipeline([
      ['INCR', KEY_TOTAL],
      ['HINCRBY', KEY_ACTIONS, action, '1'],
      ['HINCRBY', KEY_TARGETS, target, '1'],
      ['HINCRBY', KEY_DATES, day, '1'],
      ['LPUSH', KEY_RECENT, recent],
      ['LTRIM', KEY_RECENT, '0', '99'],
    ]);

    response.status(200).json({ ok: true, saved: true });
  } catch {
    response.status(202).json({ ok: true, saved: false, reason: 'storage_error' });
  }
}
