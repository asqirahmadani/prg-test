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
