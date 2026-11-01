import {
  API_URL_PACKS,
  API_URL_SECURITY_QUESTION,
  API_URL_STATUS,
  API_URL_REPORT
} from 'etc/constants';
import {
  StickerPackPartial,
  SecurityQuestion,
  PackStatus,
  ContributePayload,
  ReportPayload
} from 'etc/types';


/**
 * One entry of a v2 error response's `detail` array.
 */
export interface ApiErrorDetail {
  type: string;
  loc: Array<string | number>;
  msg: string;
}


/**
 * Error thrown for any non-2xx v2 response. `type` is the first detail's stable
 * code (e.g. 'wrong_answer'); branch on it, not on `msg`.
 */
export class ApiError extends Error {
  status: number;
  details: Array<ApiErrorDetail>;
  type: string;
  msg: string;

  constructor(status: number, details: Array<ApiErrorDetail>) {
    super(details[0]?.msg ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.type = details[0]?.type ?? '';
    this.msg = details[0]?.msg ?? '';
  }
}


/**
 * Field path of the first error detail, relative to the request body's
 * `data` parameter: ["body", "data", "pack", "source"] → "pack.source".
 * Undefined when the error is not tied to a specific body field (e.g. a 500
 * or a query-parameter error).
 */
export function errorFieldPath(err: ApiError): string | undefined {
  const loc = err.details[0]?.loc;

  if (!loc) {
    return undefined;
  }

  const dataIdx = loc.findIndex(part => part === 'data');

  if (dataIdx === -1 || dataIdx === loc.length - 1) {
    return undefined;
  }

  return loc.slice(dataIdx + 1).join('.');
}


/**
 * Low-level v2 request helper. Throws ApiError on non-2xx; resolves to
 * `undefined` on 204 (empty body).
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Merge the caller's headers on top of the defaults: spreading `init`
  // directly would replace the `headers` key wholesale and drop `Accept`.
  const headers = new Headers({ Accept: 'application/json' });
  new Headers(init.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  const response = await fetch(path, {
    ...init,
    headers
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(response.status, body?.detail ?? []);
  }

  return body as T;
}


// ----- Endpoints ---------------------------------------------------------------

export function getPacks(limit?: number): Promise<Array<StickerPackPartial>> {
  const query = limit != null ? `?limit=${limit}` : '';
  return request<Array<StickerPackPartial>>(`${API_URL_PACKS}${query}`);
}


export function getSecurityQuestion(): Promise<SecurityQuestion> {
  return request<SecurityQuestion>(API_URL_SECURITY_QUESTION, { method: 'POST' });
}


export function contributePack(payload: ContributePayload): Promise<void> {
  return request<void>(API_URL_PACKS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}


export function getPackStatus(id: string, key: string): Promise<PackStatus> {
  const query = new URLSearchParams({ id, key }).toString();
  return request<PackStatus>(`${API_URL_STATUS}?${query}`);
}


export function reportPack(payload: ReportPayload): Promise<void> {
  return request<void>(API_URL_REPORT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
