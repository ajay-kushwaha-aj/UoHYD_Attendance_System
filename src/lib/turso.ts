import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

/**
 * Turso Database Client Instance
 * Connects to Turso (libSQL) using credentials from environment variables.
 */
export const turso = createClient({
  url: url || "",
  authToken: authToken,
});

/**
 * Helper utility to verify if Turso credentials are configured.
 */
export function isTursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}
