type VercelRequest = {
  method?: string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
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

async function redisPipeline(commands: string[][]): Promise<Array<{ result?: unknown; error?: unknown }>> {
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

  return response.json() as Promise<Array<{ result?: unknown; error?: unknown }>>;
}

function toNumber(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function hashToSortedRows(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];

  const rows: Array<{ key: string; count: number }> = [];

  for (let i = 0; i + 1 < value.length; i += 2) {
    rows.push({
      key: String(value[i] ?? ''),
      count: toNumber(value[i + 1]),
    });
  }

  return rows
    .filter((row) => row.key)
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, 'ja'))
    .slice(0, limit);
}

function parseRecent(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry !== 'string') return null;
      try {
        const parsed = JSON.parse(entry) as {
          at?: unknown;
          action?: unknown;
          target?: unknown;
          page?: unknown;
        };

        return {
          at: String(parsed.at ?? ''),
          action: String(parsed.action ?? ''),
          target: String(parsed.target ?? ''),
          page: String(parsed.page ?? ''),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  setNoStore(response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    response.status(200).json({
      ok: true,
      configured: false,
      total: 0,
      actions: [],
      targets: [],
      dates: [],
      recent: [],
    });
    return;
  }

  try {
    const result = await redisPipeline([
      ['GET', KEY_TOTAL],
      ['HGETALL', KEY_ACTIONS],
      ['HGETALL', KEY_TARGETS],
      ['HGETALL', KEY_DATES],
      ['LRANGE', KEY_RECENT, '0', '49'],
    ]);

    response.status(200).json({
      ok: true,
      configured: true,
      total: toNumber(result[0]?.result),
      actions: hashToSortedRows(result[1]?.result, 20),
      targets: hashToSortedRows(result[2]?.result, 200),
      dates: hashToSortedRows(result[3]?.result, 90).sort((a, b) => b.key.localeCompare(a.key)),
      recent: parseRecent(result[4]?.result),
    });
  } catch {
    response.status(200).json({
      ok: true,
      configured: false,
      total: 0,
      actions: [],
      targets: [],
      dates: [],
      recent: [],
      error: 'storage_error',
    });
  }
}
