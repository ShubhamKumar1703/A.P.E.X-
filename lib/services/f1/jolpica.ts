/**
 * Base Jolpica/Ergast API Client
 * Provides network fetch execution, request caching, and error mapping utilities.
 */

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

export class F1ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "F1ApiError";
    this.status = status;
  }
}

/**
 * Generic fetch wrapper for Jolpica Ergast endpoints
 */
export async function fetchFromJolpica<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new F1ApiError(
        `Jolpica API request failed with status: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof F1ApiError) {
      throw error;
    }
    
    const errMsg = error instanceof Error ? error.message : "Unknown fetch failure";
    throw new F1ApiError(`Network connection to F1 API failed: ${errMsg}`);
  }
}
