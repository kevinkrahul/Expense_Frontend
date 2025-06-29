import { isTokenExpired } from "./token";
import { refreshAccessToken } from "./refreshToken";

export async function apiRequest(
  url: string,
  data: any,
  method = "POST"
): Promise<any> {
  let token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
    if (!token) throw new Error("Session expired. Please log in again.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Request failed");
  }

  return res.json();
}
