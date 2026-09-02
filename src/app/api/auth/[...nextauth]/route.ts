import { handlers } from "@/auth";

/**
 * Titik masuk Auth.js: menangani /api/auth/signin, /callback, /session,
 * /signout, dan alur OAuth Google.
 */
export const { GET, POST } = handlers;
