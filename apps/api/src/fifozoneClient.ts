import axios, { AxiosInstance } from 'axios';

const DEFAULT_TIMEOUT = 5000;

export class FifozoneClient {
  private axios: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string, timeout = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.axios = axios.create({ timeout });
  }

  // Simple retry wrapper: retries on network errors or 5xx up to `retries` times.
  async fetch(path = '/wp-json', retries = 2) {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    let attempt = 0;
    let lastErr: any;

    while (attempt <= retries) {
      try {
        const res = await this.axios.get(url, { headers: { Accept: 'application/json' } });
        return res.data;
      } catch (err: any) {
        lastErr = err;
        // if non-retryable (4xx), break
        const status = err?.response?.status;
        if (status && status >= 400 && status < 500) break;
        attempt += 1;
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }

    throw lastErr;
  }
}

export default FifozoneClient;
