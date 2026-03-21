import type { IntakeFormData, AssessmentResult } from './types';
import { SYSTEM_PROMPT } from './prompt';
import { DEMO_RESULT } from './demo-data';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 8000;
const MAX_RETRIES = 2;

// ─── Core API Call ──────────────────────────────────────────────────────────

async function fetchWithRetry(
  intakeData: IntakeFormData,
  attempt: number = 0
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: JSON.stringify(intakeData) }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Claude API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return data.content[0].text as string;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(intakeData, attempt + 1);
    }
    throw error;
  }
}

function parseClaudeResponse(raw: string): AssessmentResult {
  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned) as AssessmentResult;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function callClaudeAPI(
  intakeData: IntakeFormData
): Promise<AssessmentResult> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '') {
    console.warn('[Vazhi] No API key set — using demo fallback.');
    return DEMO_RESULT;
  }

  try {
    const rawText = await fetchWithRetry(intakeData);
    const result = parseClaudeResponse(rawText);
    return result;
  } catch (error) {
    console.error('[Vazhi] Claude API failed — using demo fallback:', error);
    return DEMO_RESULT;
  }
}

export { DEMO_RESULT };
