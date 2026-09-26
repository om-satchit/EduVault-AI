/**
 * Gemini AI Key Management Service
 * Allows users to paste and persist their Google Gemini API Key on the website.
 * The key is stored in localStorage and sent via 'X-Gemini-API-Key' header on all AI requests.
 */

const STORAGE_KEY = 'eduvault_gemini_api_key';

type KeyChangeListener = (hasKey: boolean, keyMask: string) => void;
const listeners: Set<KeyChangeListener> = new Set();

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    notifyListeners();
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyListeners();
  } catch (e) {
    console.error('Failed to remove API key from localStorage', e);
  }
}

export function hasStoredApiKey(): boolean {
  return Boolean(getStoredApiKey());
}

export function getMaskedApiKey(): string {
  const key = getStoredApiKey();
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

export function subscribeToApiKeyChanges(listener: KeyChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(): void {
  const hasKey = hasStoredApiKey();
  const mask = getMaskedApiKey();
  listeners.forEach(fn => fn(hasKey, mask));
}

/**
 * Validates a Gemini API Key against the backend verification endpoint
 * with direct Google Gemini API fallback when running in static preview environments.
 */
export async function validateGeminiApiKey(key: string): Promise<{ valid: boolean; model?: string; error?: string }> {
  const cleanKey = key.trim();
  if (!cleanKey) {
    return { valid: false, error: 'Please enter or paste a valid Gemini API key.' };
  }

  // 1. Try server proxy route first
  try {
    const res = await fetch('/api/ai/validate-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gemini-API-Key': cleanKey,
      },
      body: JSON.stringify({ apiKey: cleanKey }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.valid) {
        return data;
      }
      if (data && data.error) {
        return { valid: false, error: data.error };
      }
    }
  } catch {
    // Backend endpoint not accessible or not running, proceed to direct check
  }

  // 2. Direct client validation with Google Generative Language API
  // Essential for preview deployments and environments where /api is not routed to Node
  try {
    const directRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(cleanKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with CONNECTED only.' }] }],
        }),
      }
    );

    const contentType = directRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await directRes.json();
      if (directRes.ok && data.candidates && data.candidates.length > 0) {
        return {
          valid: true,
          model: 'gemini-3.8-flash',
          error: undefined,
        };
      }
      if (data.error && data.error.message) {
        return {
          valid: false,
          error: data.error.message,
        };
      }
    }

    return {
      valid: false,
      error: `Gemini API returned status ${directRes.status}. Please ensure your API key is active.`,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err?.message || 'Network error verifying key with Google Gemini API.',
    };
  }
}
