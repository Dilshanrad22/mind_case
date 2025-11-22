# API Ninjas Exercises API Setup Guide

## What is the API Ninjas Exercises API?

The **Exercises API** from API Ninjas provides a comprehensive database of fitness exercises with detailed information:

### Features:
- **900+ exercises** covering all major muscle groups
- **Filters available:**
  - `muscle` - Target specific muscle groups (biceps, triceps, chest, legs, back, etc.)
  - `type` - Exercise types (cardio, strength, stretching, plyometrics, etc.)
  - `difficulty` - Beginner, intermediate, or expert
  - `name` - Search by exercise name

### What You Get:
Each exercise includes:
- **Name** - Exercise name
- **Type** - Cardio, strength, etc.
- **Muscle** - Primary muscle group
- **Equipment** - Required equipment (or body_only)
- **Difficulty** - Skill level required
- **Instructions** - Step-by-step how to perform the exercise

## How It Benefits Your MindEase App

Physical exercise is proven to improve mental health! Your app now helps users:
- Find exercises for stress relief
- Get workout suggestions
- Learn proper exercise techniques
- Track physical wellness activities

## Setup Instructions

### Step 1: Get Your Free API Key

1. Go to [https://api-ninjas.com](https://api-ninjas.com)
2. Click "Sign Up" (top right)
3. Create a free account
4. Go to "My Account" → "API Keys"
5. Copy your API key (looks like: `abcd1234...`)

### Step 2: Add Your API Key to the App

**Option A: Using app.json (Recommended)**

Open `app.json` and add your key:

```json
{
  "expo": {
    "name": "mindcase-app",
    "extra": {
      "EXERCISES_API_KEY": "YOUR_ACTUAL_API_KEY_HERE"
    }
  }
}
```

**Option B: Direct in config.js (For Testing Only)**

Open `src/config.js` and replace the placeholder:

```javascript
export const EXERCISES_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

⚠️ **Important:** Don't commit your real API key to GitHub!

### Step 3: Test the API

1. Start your app: `npx expo start`
2. Navigate to the **Exercises** tab
3. Try these searches:
   - **Muscle:** "chest" → Get chest exercises
   - **Type:** "stretching" → Get stretching exercises
   - **Muscle:** "biceps" → Get arm workouts

## How the API Works in Your App

### Current Implementation:

1. **ExercisesScreen** - Main screen with search filters
   - Input muscle group (e.g., "chest", "legs", "back")
   - Input exercise type (e.g., "strength", "cardio")
   - Press "Search" button
   - View exercise list

2. **ExerciseDetailScreen** - Shows full exercise details
   - Tap any exercise card
   - See complete instructions
   - Learn difficulty level and equipment needed

3. **Smart Caching** - Saves API calls
   - Results cached for 24 hours
   - No repeated requests for same search
   - Works offline after initial load

### API Integration Details:

**File:** `src/services/exercisesApi.js`
- Validates API key
- Handles network errors
- Caches results with AsyncStorage
- Provides helpful error messages

**File:** `src/config.js`
- Stores API key configuration
- Supports Expo environment variables
- Shows warnings if key is missing

## Example API Responses

**Request:**
```
GET https://api.api-ninjas.com/v1/exercises?muscle=chest
Headers: X-Api-Key: YOUR_KEY
```

**Response:**
```json
[
  {
    "name": "Bench Press",
    "type": "strength",
    "muscle": "chest",
    "equipment": "barbell",
    "difficulty": "beginner",
    "instructions": "Lie on bench. Lower bar to chest. Press up..."
  },
  {
    "name": "Push-ups",
    "type": "strength",
    "muscle": "chest",
    "equipment": "body_only",
    "difficulty": "beginner",
    "instructions": "Start in plank position..."
  }
]
```

## Common Muscle Groups You Can Search:

- `abdominals` - Core exercises
- `biceps` - Arm exercises
- `chest` - Chest workouts
- `calves` - Lower leg
- `forearms` - Forearm strength
- `glutes` - Gluteal muscles
- `hamstrings` - Back of thigh
- `lats` - Back/latissimus
- `quadriceps` - Front of thigh
- `triceps` - Back of arm
- `traps` - Trapezius

## Exercise Types:

- `cardio` - Cardiovascular exercises
- `strength` - Resistance training
- `stretching` - Flexibility exercises
- `plyometrics` - Jump training
- `powerlifting` - Heavy lifting
- `strongman` - Strongman events
- `olympic_weightlifting` - Olympic lifts

## Troubleshooting

### Error: "Invalid API Key"
- Check if you copied the full key
- No extra spaces at start/end
- Key should be from api-ninjas.com

### Error: "Missing API key"
- You haven't replaced the placeholder
- Check `app.json` or `src/config.js`

### No exercises showing:
- Check your internet connection
- Try searching without filters first
- Look for error messages in red

### API Rate Limits:
- Free tier: 10,000 requests/month
- That's ~330 searches per day
- More than enough for testing!

## Testing Checklist

- [ ] API key added to config
- [ ] App restarts successfully
- [ ] Can search for "chest" exercises
- [ ] Can search for "stretching" type
- [ ] Can tap exercise to see details
- [ ] Cache works (search same thing twice - faster second time)
- [ ] Error messages show if no internet

## Your App is Ready! 🎉

The API Ninjas Exercises API is now integrated into your MindEase app. Users can:
- Search 900+ exercises
- Filter by muscle group and type
- Learn proper exercise techniques
- Support their mental wellness with physical activity

**Remember:** Physical exercise improves mood, reduces stress, and boosts mental health - perfect for your wellness app!
