/**
 * OpenF1 API HTTP client wrapper
 * Handles network connections, query filters, error traps, and rate-limit backoff.
 */

const OPENF1_BASE_URL = "https://api.openf1.org/v1";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch helper for OpenF1 API with built-in retry and backoff for rate limiting.
 * Converts key/values into URL parameters.
 */
export async function fetchFromOpenF1<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  retries = 4,
  baseDelayMs = 300
): Promise<T> {
  const url = new URL(`${OPENF1_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        url.searchParams.append(key, val.toString());
      }
    });
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json"
        }
      });

      // Handle HTTP 429 Too Many Requests
      if (res.status === 429) {
        if (attempt === retries) {
          throw new Error(`OpenF1 API rate limited (429) after ${retries} attempts`);
        }
        
        // Exponential backoff with randomized jitter to spread out retries
        const backoff = baseDelayMs * Math.pow(2, attempt) + Math.random() * 150;
        console.warn(
          `OpenF1 429 Rate Limit [${endpoint}]. Retrying in ${Math.round(backoff)}ms (Attempt ${attempt}/${retries})...`
        );
        await delay(backoff);
        continue;
      }

      if (!res.ok) {
        throw new Error(`OpenF1 API responded with status ${res.status}`);
      }

      return await res.json() as T;
    } catch (error) {
      if (attempt === retries) {
        console.error(`OpenF1 Fetch Failure [${endpoint}]:`, error);
        throw error;
      }
      
      // For network connection errors or other exceptions, back off and retry
      const backoff = baseDelayMs * Math.pow(2, attempt) + Math.random() * 150;
      await delay(backoff);
    }
  }

  throw new Error(`OpenF1 Fetch Failure [${endpoint}]: Max retries reached`);
}
