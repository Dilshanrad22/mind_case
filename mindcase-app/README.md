# MindEase Mobile App (Expo)

Initial scaffold for MindEase based on provided Figma intention (placeholder until precise tokens/components are supplied).

## Structure
```
src/
  navigation/RootNavigator.js
  screens/ (Welcome, SignIn, SignUp, Home, Mood, Journal, Exercises, Profile)
  components/PrimaryButton.js
  theme/ (colors, typography, spacing, index)
  store/AppContext.js
```

## Next Steps
1. Provide exact Figma design tokens (colors, fonts, radii, spacing) to refine theme.  
2. Supply component variants (cards, inputs, mood selector UI).  
3. Add icons (already using `@expo/vector-icons`).  
4. Persist data (AsyncStorage now used for exercises caching; extend for mood/journal).  
5. Add analytics & push notification reminders (daily mood check).  
6. Secure API key management.

## Running
```bash
npm install
npm start
```
(After adding navigation dependencies below.)

## Navigation Dependencies (to install)
```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
```

## Theming
`ThemeProvider` supplies `colors`, `typography`, and `spacing` via context. Extend with radii, shadows, gradients after token export.

## State
Simple React Context with in-memory arrays. Replace with persistent storage later.

## Exercises API Integration
Add your API Ninjas key in `src/config.js` replacing `YOUR_API_NINJAS_KEY_HERE`.
Screen `ExercisesScreen` supports filtering by `muscle` and `type`. Results are cached for 24h via AsyncStorage.
Response normalization handled by `src/services/exercisesApi.js`.

For production, do not hardcode the key—use secure storage or a backend proxy to avoid exposing secrets.

## Contribution
Submit design specs to iterate toward pixel-perfect parity.
