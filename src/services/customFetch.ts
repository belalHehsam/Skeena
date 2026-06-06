import { t } from "i18next";
import { API_BASE_URL } from "@/constants/backendAPIsConfig";
import { DEFAULT_LOCALE } from "@/constants/i18nConfig";

export async function customFetch<T>(
  endpoint: string,
  options: RequestInit & { passcode?: string } = {},
  isJsonResponse = true,
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData
      ? {
          Accept: "application/json",
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
    "accept-language": localStorage.getItem("i18nextLng") || DEFAULT_LOCALE,
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method: options.method || "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  // Check for any HTTP errors
  if (!response.ok) {
    const errorBody = await response.json();
    const error = {
      message: errorBody.message || t("an-error-occurred"),
      errorBody: errorBody.data || null,
      status: response.status,
    };

    throw error;
  }

  // If the response is not JSON, return it as is
  if (!isJsonResponse) {
    return response as unknown as T;
  }

  const data = await response.json();

  return data;
}
