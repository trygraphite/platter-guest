export async function restaurantExists(subdomain: string): Promise<boolean> {
  if (!subdomain) return false;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiBase}/account/business/${subdomain}`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!(data && data.data);
  } catch {
    return false;
  }
} 