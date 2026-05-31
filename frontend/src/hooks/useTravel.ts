import { mutate as globalMutate } from "swr";
import useSWRMutation from "swr/mutation";
import { useAuth } from "../hooks/auth";
import type { TravelRequest } from "../types/travel";
import { mutator } from "../utils/fetcher";

export function useCreateTravel() {
  const { user } = useAuth();

  return useSWRMutation(
    "/travels",
    (url: string, { arg }: { arg: Omit<TravelRequest, "id"> }) =>
      mutator(url, {
        arg: {
          method: "POST",
          data: arg,
          header: { Authorization: `Bearer ${user.token}` },
        },
      }),
    { onSuccess: () => globalMutate("/travels") },
  );
}

export function useTravel() {
  const { trigger: createTrigger } = useCreateTravel();

  const create = (data: TravelRequest) => createTrigger(data);

  return { create };
}
