import axios, { AxiosError, type AxiosAdapter } from 'axios';
import { getResponse } from 'msw';
import { handlers } from './handlers';

/** Runs the MSW handlers in-page (no service worker) for static previews. */
export const mockAdapter: AxiosAdapter = async (config) => {
  const url = new URL(axios.getUri(config), location.origin);
  const method = (config.method ?? 'get').toUpperCase();
  const body =
    method === 'GET' || config.data == null
      ? undefined
      : typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data);
  const res = await getResponse(
    handlers,
    new Request(url, { method, body, headers: { 'content-type': 'application/json' } }),
  );
  if (!res) throw new AxiosError(`No mock for ${method} ${url.pathname}`, 'ERR_NOT_FOUND', config);
  const data = await res.json().catch(() => null);
  const out = { data, status: res.status, statusText: res.statusText, headers: {}, config, request: {} };
  if (res.status >= 400)
    throw new AxiosError(
      `Request failed with status ${res.status}`,
      'ERR_BAD_REQUEST',
      config,
      undefined,
      out,
    );
  return out;
};
