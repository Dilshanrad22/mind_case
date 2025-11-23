import { EXERCISES_API_KEY, EXERCISES_API_BASE } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, v); });
  return search.toString();
}

function validateApiKey() {
  if (!EXERCISES_API_KEY || EXERCISES_API_KEY === 'YOUR_API_NINJAS_KEY_HERE') {
    throw new Error('Missing API key: set EXERCISES_API_KEY in src/config.js');
  }
  if (EXERCISES_API_KEY.trim() !== EXERCISES_API_KEY) {
    throw new Error('API key has leading/trailing whitespace – clean it.');
  }
}

export async function fetchExercises(params = {}) {
  validateApiKey();
  const query = buildQuery(params);
  const cacheKey = `exercises_cache_${query || 'all'}`;
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.timestamp < ONE_DAY_MS) {
        return { data: cached.data, fromCache: true };
      }
    }
  } catch (e) {
    // ignore cache read errors
  }

  const url = query ? `${EXERCISES_API_BASE}?${query}` : EXERCISES_API_BASE;
  let resp;
  try {
    resp = await fetch(url, { headers: { 'X-Api-Key': EXERCISES_API_KEY } });
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}`);
  }
  if (!resp.ok) {
    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); } catch (_) { /* non-JSON */ }
    const rawMsg = (json && (json.error || json.message)) || text;

    // Common specific cases mapped to clearer guidance
    if (resp.status === 400 && /Invalid API Key/i.test(rawMsg)) {
      throw new Error('Invalid API Key: verify it in your API Ninjas dashboard and update EXERCISES_API_KEY.');
    }
    if (resp.status === 400 && /currently down for free users/i.test(rawMsg)) {
      // Endpoint temporarily unavailable for free tier – treat like a soft failure
      throw new Error('Exercises API temporarily unavailable for free users. Showing local sample exercises. (Upgrade plan or try later)');
    }
    if (resp.status === 401) {
      throw new Error('Unauthorized (401): key rejected. Regenerate key or confirm header name X-Api-Key.');
    }
    if (resp.status === 429) {
      throw new Error('Rate limit exceeded (429): wait, reduce requests, or upgrade your plan.');
    }
    throw new Error(`API error ${resp.status}: ${rawMsg}`);
  }
  const data = await resp.json();
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {
    // ignore cache write errors
  }
  return { data, fromCache: false };
}
