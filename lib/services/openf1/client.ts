/**
 * OpenF1 API HTTP client wrapper
 * Handles network connections, query filters, and error traps.
 */

const OPENF1_BASE_URL = "https://api.openf1.org/v1";

/**
 * Fetch helper for OpenF1 API.
 * Converts key/values into URL parameters.
 */
export async function fetchFromOpenF1<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${OPENF1_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) {
        url.searchParams.append(key, val.toString());
      }
    });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json"
      },
      // Cache settings: keep cached for 2 seconds to avoid overloading
      next: { revalidate: 2 }
    });

    if (!res.ok) {
      throw new Error(`OpenF1 API responded with status ${res.status}`);
    }

    return await res.json() as T;
  } catch (error) {
    console.error(`OpenF1 Fetch Failure [${endpoint}]:`, error);
    throw error;
  }
}
