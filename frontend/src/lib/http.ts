// Shared fetch-response helpers.
//
// Calling `res.json()` directly on an error response is fragile: if the
// server (or a proxy/load balancer in front of it) returns a non-JSON body
// — an HTML error page, an empty 204, a plain-text 502 — `res.json()` throws
// a confusing "Unexpected token <" instead of the real error. These helpers
// check the `content-type` header first and fall back to a sane message.

export async function parseJsonSafe(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function errorMessage(data: any, fallback: string): string {
  return (data && (data.message || data.error)) || fallback;
}
