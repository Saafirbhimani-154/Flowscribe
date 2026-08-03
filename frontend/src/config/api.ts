// Single source of truth for the backend API base URL.
// Falls back to a sane local-dev default so requests never silently
// hit relative paths like `/flows/analyze` (which 404 against the
// Express server, since real routes live at `/api/v1/flows/analyze`).
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
