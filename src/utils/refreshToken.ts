export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to refresh access token");

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    return data.access_token;
  } catch (err) {
    console.error("Refresh error:", err);
    return null;
  }
}
