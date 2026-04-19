export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new ApiError(`Request failed: ${response.status}`, response.status);
      }
      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(error instanceof Error ? error.message : 'Unexpected network error');
    }
  },
};
