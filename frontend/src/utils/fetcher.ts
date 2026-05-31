import { useAuth } from "../hooks/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface MutatorArgs<TData = unknown> {
  method?: HTTPMethod;
  data?: TData;
  header?: Record<string, string>;
}

export const authFetcher = async ([url, accessToken]: string[]) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Not found error");
    throw new Error("Failed to fetch");
  }
  return await res.json();
};

export const fetcher = async <TData = unknown, TResponse = unknown>(
  endpoint: string,
  arg?: MutatorArgs<TData>,
) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const { user } = useAuth();

  const token = user.token;
  const headers: Record<string, string> = {
    ...arg?.header,
    ...(arg && arg.data && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, {
    method: (arg && arg.method) || "GET",
    headers: headers,
    body: arg && arg.data ? JSON.stringify(arg.data) : undefined,
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      json?.data?.error ||
        json?.message ||
        res.statusText ||
        "An error occurred when fetching the API",
    );
  }

  return json as TResponse;
};

export const mutator = async <TData = unknown, TResponse = unknown>(
  endpoint: string,
  { arg }: { arg: MutatorArgs<TData> },
) => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const { user } = useAuth();

  const token = user.token;
  const headers: Record<string, string> = {
    ...(arg.data && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, {
    method: arg.method || "POST",
    headers,
    body: arg.data ? JSON.stringify(arg.data) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      json?.data?.error ||
        json?.message ||
        res.statusText ||
        "An error occurred while mutating data.",
    );
  }

  if (res.status === 204) return null;

  return json as TResponse;
};
