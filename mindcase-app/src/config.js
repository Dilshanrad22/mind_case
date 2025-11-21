// API Ninjas Exercises API configuration
// Preferred: inject key via Expo "extra" (app.json/app.config.js) so you do not hardcode secrets.
// Fallback: replace 'YOUR_API_NINJAS_KEY_HERE' directly ONLY for local private development.
import Constants from 'expo-constants';

// Support multiple manifest shapes (SDK differences, web vs native)
const extra = (
	Constants.expoConfig?.extra ||
	Constants.manifest?.extra ||
	Constants.manifest2?.extra ||
	{}
);

export const EXERCISES_API_KEY = extra.EXERCISES_API_KEY || 'YOUR_API_NINJAS_KEY_HERE';
export const EXERCISES_API_BASE = 'https://api.api-ninjas.com/v1/exercises';

if (!extra.EXERCISES_API_KEY) {
	// Non-fatal warning to help debug missing key
	// eslint-disable-next-line no-console
	console.warn('[ExercisesAPI] EXERCISES_API_KEY not found in app config extra. Using placeholder.');
}

export function isApiKeyConfigured() {
	return !!extra.EXERCISES_API_KEY && EXERCISES_API_KEY !== 'YOUR_API_NINJAS_KEY_HERE';
}
