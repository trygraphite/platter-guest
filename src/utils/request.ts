import axios from "axios";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Make a request to the Platter API
 * @param endpoint - The URL to make the request to
 * @param method - The method to make the request with
 * @param body - The data to send with the request
 * @returns The full Axios response from the request
 */
export async function request<T>(
  endpoint: string,
  method: RequestMethod = "GET",
  body?: unknown,
) {
  const response = await axios<T>({
    method,
    url: `${BASE_URL}${endpoint}`,
    data: body,
  });
  return response;
}
