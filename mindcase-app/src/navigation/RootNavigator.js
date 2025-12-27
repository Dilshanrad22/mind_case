import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import MoodScreen from '../screens/MoodScreen';
import JournalScreen from '../screens/JournalScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';
import NewJournalEntryScreen from '../screens/NewJournalEntryScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import ChatScreen from '../screens/ChatScreen';
import FoodTrackerScreen from '../screens/FoodTrackerScreen';
import NutritionHistoryScreen from '../screens/NutritionHistoryScreen';
import DraggableChatButton from '../components/DraggableChatButton';
import { useTheme } from '../theme';
import { loadStoredAuth } from '../redux/slices/authSlice';
import { loadFavoritesFromStorage } from '../redux/slices/favoritesSlice';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const JournalStack = createNativeStackNavigator();
const MoodStack = createNativeStackNavigator();
const ExercisesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const NutritionStack = createNativeStackNavigator();

function MoodStackNavigator() {
  const theme = useTheme();
  return (
    <MoodStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false
      }}
    >
      <MoodStack.Screen name="MoodHome" component={MoodScreen} options={{ title: 'Mood' }} />
      <MoodStack.Screen name="MoodHistory" component={MoodHistoryScreen} options={{ title: 'History' }} />
    </MoodStack.Navigator>
  );
}

function JournalStackNavigator() {
  const theme = useTheme();
  return (
    <JournalStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false
      }}
    >
      <JournalStack.Screen name="JournalHome" component={JournalScreen} options={{ title: 'Journal' }} />
      <JournalStack.Screen name="JournalEntry" component={JournalEntryScreen} options={{ title: 'Entry' }} />
      <JournalStack.Screen name="NewJournalEntry" component={NewJournalEntryScreen} options={{ title: 'New Entry' }} />
    </JournalStack.Navigator>
  );
}

function ExercisesStackNavigator() {
  const theme = useTheme();
  return (
    <ExercisesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false
      }}
    >
      <ExercisesStack.Screen name="ExercisesHome" component={ExercisesScreen} options={{ title: 'Exercises' }} />
      <ExercisesStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Exercise' }} />
      <ExercisesStack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'My Favorites' }} />
    </ExercisesStack.Navigator>
  );
}

function NutritionStackNavigator() {
  const theme = useTheme();
  return (
    <NutritionStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false
      }}
    >
      <NutritionStack.Screen name="FoodTracker" component={FoodTrackerScreen} options={{ headerShown: false }} />
      <NutritionStack.Screen name="NutritionHistory" component={NutritionHistoryScreen} options={{ headerShown: false }} />
    </NutritionStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const theme = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false
      }}
    >
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <ProfileStack.Screen name="Help" component={HelpScreen} options={{ title: 'Help & Support' }} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home',
            Mood: 'happy',
            Journal: 'book',
            Nutrition: 'nutrition',
            Exercises: 'body',
            Profile: 'person'
          };
          const name = iconMap[route.name] || 'ellipse';
          return <Ionicons name={name} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodStackNavigator} />
      <Tab.Screen name="Journal" component={JournalStackNavigator} />
      <Tab.Screen name="Nutrition" component={NutritionStackNavigator} />
      <Tab.Screen name="Exercises" component={ExercisesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    // Load stored auth and favorites on app start
    const initializeApp = async () => {
      await dispatch(loadStoredAuth());
      await dispatch(loadFavoritesFromStorage());
      setIsLoading(false);
    };
    
    initializeApp();
  }, [dispatch]);

  const handleChatPress = () => {
    if (navigationRef.current && isAuthenticated) {
      navigationRef.current.navigate('Chat');
    }
  };

  const onNavigationStateChange = (state) => {
    // Check if current route is Chat
    const currentRoute = state?.routes?.[state.index]?.name;
    setIsChatOpen(currentRoute === 'Chat');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} onStateChange={onNavigationStateChange}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.surface },
            headerTintColor: theme.colors.text,
            headerShadowVisible: false
          }}
        >
          {!isAuthenticated ? (
            <>
              <RootStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <RootStack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
              <RootStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Create Account' }} />
            </>
          ) : (
            <>
              <RootStack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
              <RootStack.Screen 
                name="Chat" 
                component={ChatScreen} 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                  animation: 'slide_from_bottom'
                }} 
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
      
      {/* Draggable Chat Button - Only visible when authenticated and chat is not open */}
      <DraggableChatButton 
        onPress={handleChatPress} 
        visible={isAuthenticated && !isChatOpen} 
      />
    </View>
  );
}
