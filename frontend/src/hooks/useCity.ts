import useSWR from "swr";
import { mutate as globalMutate } from "swr";
import type { City } from "../api/city";
import { authFetcher, mutator } from "../utils/fetcher";
import { useMemo } from "react";
import { useAuth } from "../hooks/auth";
import type { SelectOption } from "../types/base";
import useSWRMutation from "swr/mutation";
import type { CityRequest } from "../types/city";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export function useCities() {
  const { user } = useAuth();

  const { data, ...rest } = useSWR<{ message: string; data: City[] }>(
    [`${API_BASE_URL}/cities`, user.token],
    authFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const cities = useMemo<SelectOption[]>(() => {
    if (!data?.data) return [];
    return data.data.map((city) => ({
      value: city.id,
      label: city.name,
    }));
  }, [data]);

  return { cities, ...rest };
}

export function useCreateCity() {
  const { user } = useAuth();

  return useSWRMutation(
    "/sdm/cities",
    (url: string, { arg }: { arg: Omit<CityRequest, "id"> }) =>
      mutator(url, {
        arg: {
          method: "POST",
          data: arg,
          header: { Authorization: `Bearer ${user.token}` },
        },
      }),
    { onSuccess: () => globalMutate("/sdm/cities") },
  );
}

export function useDeleteCity() {
  const { user } = useAuth();

  return useSWRMutation(
    "/sdm/cities",
    (url: string, { arg }: { arg: Number }) =>
      mutator(`${url}/${arg}`, {
        arg: {
          method: "DELETE",
          header: { Authorization: `Bearer ${user.token}` },
        },
      }),
    { onSuccess: () => globalMutate("/sdm/cities") },
  );
}

export function useCity() {
  const { trigger: createTrigger } = useCreateCity();
  const { trigger: triggerDelete, isMutating: loadingDelete } = useDeleteCity();

  const create = (data: CityRequest) => createTrigger(data);
  const deleted = (id: Number) => triggerDelete(id);

  return { create, deleted, loadingDelete };
}
