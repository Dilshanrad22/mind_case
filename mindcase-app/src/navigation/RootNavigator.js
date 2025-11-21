import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import MoodScreen from '../screens/MoodScreen';
import JournalScreen from '../screens/JournalScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';
import NewJournalEntryScreen from '../screens/NewJournalEntryScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import { useTheme } from '../theme';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const JournalStack = createNativeStackNavigator();
const MoodStack = createNativeStackNavigator();
const ExercisesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

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
    </ExercisesStack.Navigator>
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
            Exercises: 'body',
            Profile: 'person',
            Insights: 'stats-chart',
            Resources: 'library'
          };
          const name = iconMap[route.name] || 'ellipse';
          return <Ionicons name={name} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodStackNavigator} />
      <Tab.Screen name="Journal" component={JournalStackNavigator} />
      <Tab.Screen name="Exercises" component={ExercisesStackNavigator} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <RootStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false
        }}
      >
        <RootStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
        <RootStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Create Account' }} />
        <RootStack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
