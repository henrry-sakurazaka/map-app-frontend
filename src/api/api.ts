
export async function fetchProtected<T>(endpoint: string): Promise<T> {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");

  const res = await fetch(`http://localhost:3001/api/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Request failed");
  }

  // 型を保証して返す
  const data: T = await res.json();
  return data;
}

