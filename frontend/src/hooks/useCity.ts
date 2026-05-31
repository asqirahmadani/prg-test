import useSWR from "swr";
import type { CityData } from "../api/city";
import { fetcher } from "../utils/fetcher";
import { useState } from "react";
import type { SelectOption } from "../types/base";

export function useCities() {
  const [cities, setCities] = useState<SelectOption[]>([]);

  const { data, ...rest } = useSWR<{ message: string; data: CityData }>(
    "/cities",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const citiesData: CityData | null = data?.data ? data.data : null;
  if (citiesData) {
    setCities(citiesData.cities.map((city) => ({ value: city.id, label: city.name })));
  }

  return { cities, ...rest };
}
