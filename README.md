# MindCase - Mental Health & Wellness Mobile App

A comprehensive mental health and wellness tracking application built with React Native (Expo) that helps users monitor their mood, maintain a journal, track nutrition, access exercise resources, and chat with an AI wellness assistant.

## 📱 Features

- **User Authentication**: Secure sign-up and sign-in with JWT-based authentication
- **Mood Tracking**: Log and visualize daily mood patterns with detailed history
- **Journal Entries**: Create, view, and manage personal journal entries
- **Nutrition Tracker**: Monitor daily food intake and nutritional information
- **Exercise Library**: Browse and search exercises with detailed instructions
- **AI Chat Assistant**: Get wellness support through an AI-powered chat interface
- **Insights Dashboard**: View comprehensive wellness analytics and trends
- **Favorites**: Save and access favorite exercises and resources
- **Theme Support**: Light/Dark mode toggle for comfortable viewing
- **Profile Management**: Personalize user settings and preferences

## 🏗️ Technology Stack

- **Framework**: React Native with Expo (Managed Workflow)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage & Expo SecureStore
- **Backend**: Node.js/Express REST API
- **Database**: MongoDB
- **API Integration**: Exercises API (API Ninjas)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Backend server running (see backend setup below)

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dilshanrad22/mind_case.git
cd mind_case/mindcase-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Update the API base URL in `mindcase-app/src/config.js`:

```javascript
export const API_BASE_URL = 'http://your-backend-url:5000/api';
// For local development:
// Android Emulator: 'http://10.0.2.2:5000/api'
// iOS Simulator: 'http://localhost:5000/api'
// Physical Device: 'http://YOUR_IP_ADDRESS:5000/api'
```

The Exercises API key is already configured in `app.json` under `extra.EXERCISES_API_KEY`.

### 4. Start the Development Server

```bash
npm start
```

Or use specific platforms:

```bash
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on Web
```

### 5. Scan QR Code

- Install **Expo Go** app on your mobile device
- Scan the QR code displayed in terminal
- App will load on your device

## 📂 Project Structure

```
mind_case/
├── mindcase-app/              # React Native (Expo) Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── navigation/        # Navigation configuration
│   │   ├── screens/          # Application screens
│   │   ├── redux/            # State management
│   │   ├── services/         # API integration
│   │   ├── theme/            # Design system
│   │   └── config.js         # App configuration
│   ├── assets/               # Images, icons, fonts
│   ├── android/              # Android native code
│   └── app.json             # Expo configuration
└── Backend Repository        # See backend setup below
```

## 🔌 Backend Setup

This app requires the MindCase backend server to be running. 

**Backend Repository**: [https://github.com/Dilshanrad22/mind_case_backend](https://github.com/Dilshanrad22/mind_case_backend)

### Quick Backend Setup:

```bash
# Clone backend repository
git clone https://github.com/Dilshanrad22/mind_case_backend.git
cd mind_case_backend

# Install dependencies
npm install

# Configure .env file (see .env.example)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_characters
PORT=5000
OPENAI_API_KEY=your_openai_api_key  # Optional, for chat feature

# Start server
npm start

# For development with auto-restart:
npm run dev
```

The backend should run on `http://localhost:5000`

**Backend API Endpoints**:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/moods` - Fetch mood history
- `POST /api/moods` - Log new mood
- `GET /api/journals` - Fetch journal entries
- `POST /api/journals` - Create journal entry
- `POST /api/nutrition` - Log food intake
- `POST /api/chat` - Chat with AI assistant

## 🎨 Key Screens

1. **Welcome/Authentication**: First-time user experience and login
2. **Home Dashboard**: Overview of wellness metrics and quick actions
3. **Mood Tracker**: Interactive mood logging and history visualization
4. **Journal**: Create and browse personal journal entries
5. **Food Tracker**: Log meals and view nutritional information
6. **Exercises**: Browse exercise library with filtering options
7. **Chat**: AI-powered wellness conversation assistant
8. **Insights**: Analytics and trends across all tracked metrics
9. **Profile & Settings**: User preferences and app customization

## 🔐 Authentication Flow

1. Users create an account with email/password
2. Credentials are securely stored using Expo SecureStore
3. JWT tokens are used for API authentication
4. Automatic token refresh on app restart
5. Protected routes require valid authentication

## 📊 State Management

The app uses Redux Toolkit with the following slices:
- **authSlice**: User authentication state
- **moodSlice**: Mood tracking data
- **journalSlice**: Journal entries
- **nutritionSlice**: Food tracking data
- **favoritesSlice**: User favorites

## 🧪 Testing the App

### Step-by-Step Test Flow:

1. **Start Backend**: Ensure backend server is running on port 5000
2. **Start Frontend**: Run `npm start` in mindcase-app directory
3. **Create Account**: Sign up with email and password
4. **Track Mood**: Log your current mood with optional notes
5. **Write Journal**: Create a journal entry
6. **Log Food**: Add meals to nutrition tracker
7. **Browse Exercises**: Search by muscle group or type
8. **Chat**: Ask the AI assistant wellness questions (requires OpenAI key)
9. **View Insights**: Check your wellness trends

### Test Credentials (Optional):
Create a new account during testing - no pre-configured test users are provided.

## 📝 Known Limitations & Assumptions

### Assumptions:
- Users have a stable internet connection for API calls
- MongoDB Atlas is used for database hosting
- Backend is deployed or running locally
- Users grant necessary permissions for app features

### Limitations:
- **OpenAI API Key**: Chat feature requires OpenAI API configuration in backend `.env` file
- **Exercise API**: Limited to free tier quota (API Ninjas)
- **Data Persistence**: Local data (favorites, preferences) is lost on app uninstall
- **Platform**: Optimized for mobile (iOS/Android), web support is experimental
- **Offline Mode**: Not currently supported - requires internet connection
- **Push Notifications**: Not implemented in current version
- **Image Upload**: Profile pictures and journal images not yet supported

### Future Enhancements:
- Offline data synchronization
- Push notifications for mood check-in reminders
- Data export functionality
- Social sharing features
- Integration with health tracking devices
- Multi-language support

## 🔧 Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution**: 
- Ensure backend server is running (`npm start` in backend directory)
- Check `API_BASE_URL` in `src/config.js` matches your setup:
  - Android Emulator: `http://10.0.2.2:5000/api`
  - iOS Simulator: `http://localhost:5000/api`
  - Physical Device: `http://YOUR_IP_ADDRESS:5000/api`

### Issue: Exercise data not loading
**Solution**: 
- Verify internet connection
- API key is already configured in `app.json`
- Check API quota hasn't been exceeded

### Issue: Authentication errors
**Solution**: 
- Verify backend is running
- Clear app storage: Device Settings > Apps > Expo Go > Clear Data
- Try signing up with a new account

### Issue: Chat feature not working
**Solution**: 
- Ensure `OPENAI_API_KEY` is configured in backend `.env` file
- Check backend console for API errors

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku):

```bash
# The backend includes render.yaml for Render deployment
# Update environment variables in hosting platform:
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<secure_random_string_min_32_chars>
OPENAI_API_KEY=<your_openai_key>
```

### Mobile App Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📄 Additional Documentation

- [API Setup Guide](mindcase-app/API_SETUP_GUIDE.md)
- [Authentication Implementation](mindcase-app/AUTHENTICATION_IMPLEMENTATION.md)
- [Theme Implementation](mindcase-app/THEME_IMPLEMENTATION.md)
- [Token Fix Guide](mindcase-app/TOKEN_FIX.md)
- [Journal & Mood API Documentation](../mind_case_backend/JOURNAL_MOOD_API.md)

## 🎯 Project Requirements Met

This project demonstrates:
- ✅ React Native with Expo managed workflow
- ✅ Multiple screen navigation (10+ screens)
- ✅ External API integration (Exercises API, OpenAI)
- ✅ Backend REST API integration
- ✅ User authentication and authorization
- ✅ State management (Redux Toolkit)
- ✅ Local data persistence (AsyncStorage, SecureStore)
- ✅ Form validation and error handling
- ✅ Responsive UI design
- ✅ Code organization and best practices
- ✅ Environment configuration management

## 👨‍💻 Development Notes

- **Expo SDK**: Version 54
- **React**: Version 19.1.0
- **React Native**: Version 0.81.5
- **Navigation**: React Navigation v6
- **Code Style**: ES6+ with async/await patterns
- **Architecture**: Feature-based folder structure
- **Testing**: Manual testing performed on iOS Simulator and Android Emulator

## 📱 Device Compatibility

- **iOS**: 13.0 and above
- **Android**: 6.0 (API 23) and above
- **Tested on**:
  - iOS Simulator (iPhone 14, 15)
  - Android Emulator (Pixel 5, 6)
  - Physical devices via Expo Go

## 🙏 Acknowledgments

- **API Ninjas**: Exercise data API provider
- **Expo Team**: React Native framework and tools
- **OpenAI**: Chat functionality (GPT integration)
- **MongoDB**: Database platform
- **React Navigation**: Navigation library

## 📧 Contact

- **Developer**: Dilshan
- **GitHub**: [@Dilshanrad22](https://github.com/Dilshanrad22)
- **Repository**: [mind_case](https://github.com/Dilshanrad22/mind_case)
- **Backend**: [mind_case_backend](https://github.com/Dilshanrad22/mind_case_backend)

## 📜 License

This project was created for educational purposes as part of a mobile development challenge.

---

**Built with ❤️ using React Native & Expo**

*Submitted for Polygon Holdings Private Limited Mobile Development Challenge*
*January 2026*
