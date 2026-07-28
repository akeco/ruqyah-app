/**
 * Base URL for server-side fetches to this app's own API routes.
 *
 * `NEXT_PUBLIC_API_URL` (if set) wins. Otherwise, on Vercel `VERCEL_URL` is
 * always populated with the current deployment's URL — falling back to
 * "http://localhost:3000" alone breaks in production, since there is no
 * localhost server to reach.
 */
export function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
