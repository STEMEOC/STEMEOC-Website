// Creates a Google Sheet straight from the browser, like Google Forms' "Link to Sheets".
// The admin signs in with their own Google account (Google Identity Services popup);
// the sheet lands in their Drive. The `drive.file` scope only lets the site touch
// files it created, never the rest of their Drive. No server secret is involved.
//
// Needs NEXT_PUBLIC_GOOGLE_CLIENT_ID, an OAuth "Web application" client ID from
// Google Cloud with the Sheets API enabled and this site's URL as an authorized origin.

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const SCOPE = "https://www.googleapis.com/auth/drive.file";

type TokenResponse = { access_token?: string; expires_in?: number; error?: string; error_description?: string };
type TokenClient = { requestAccessToken: (options?: { prompt?: string }) => void };
type GoogleOAuth = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: { type: string; message?: string }) => void;
      }) => TokenClient;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleOAuth;
  }
}

let scriptPromise: Promise<void> | null = null;
let cachedToken: { value: string; expiresAt: number } | null = null;

/** Load Google's sign-in script ahead of the click, so the popup opens inside the click and isn't blocked. */
export function preloadGoogle(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't load Google sign-in. Check your internet connection."));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Must be called directly from a click handler (after preloadGoogle has finished). */
export function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return Promise.resolve(cachedToken.value);
  const google = window.google;
  if (!google?.accounts?.oauth2) return Promise.reject(new Error("Google sign-in is still loading. Try again."));

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (!response.access_token) {
          reject(new Error(response.error_description || "Google sign-in was cancelled."));
          return;
        }
        cachedToken = { value: response.access_token, expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000 };
        resolve(response.access_token);
      },
      error_callback: (error) =>
        reject(
          new Error(
            error.type === "popup_closed"
              ? "The Google sign-in window was closed."
              : error.type === "popup_failed_to_open"
                ? "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again."
                : error.message || "Google sign-in failed."
          )
        ),
    });
    client.requestAccessToken();
  });
}

/** Creates a spreadsheet with a bold, frozen header row. Returns its URL. */
export async function createSheet(token: string, title: string, table: string[][]): Promise<string> {
  const rowData = table.map((row, r) => ({
    values: row.map((text) => ({
      userEnteredValue: { stringValue: text },
      ...(r === 0 ? { userEnteredFormat: { textFormat: { bold: true } } } : {}),
    })),
  }));

  const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: { title: "Responses", gridProperties: { frozenRowCount: 1 } },
          data: [{ startRow: 0, startColumn: 0, rowData }],
        },
      ],
    }),
  });

  if (!res.ok) {
    if (res.status === 401) cachedToken = null;
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(body?.error?.message || `Google Sheets returned an error (${res.status}).`);
  }
  const sheet = (await res.json()) as { spreadsheetUrl: string };
  return sheet.spreadsheetUrl;
}
