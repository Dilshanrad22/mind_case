import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.isDark 
          ? [theme.colors.background, theme.colors.primaryDark + '20', theme.colors.background]
          : ['#E8F4F8', '#F0F8FF', theme.colors.background]}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        {/* Header illustration section */}
        <View style={styles.illustrationSection}>
          {/* Mental wellness illustration using icons */}
          <View style={styles.illustrationContainer}>
            {/* Person meditating icon */}
            <View style={[styles.mainIconCircle, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="person" size={80} color="#fff" />
            </View>
            
            {/* Surrounding wellness icons */}
            <View style={[styles.floatingIcon, styles.icon1, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="heart" size={32} color={theme.colors.primary} />
            </View>
            
            <View style={[styles.floatingIcon, styles.icon2, { backgroundColor: theme.colors.info + '20' }]}>
              <Ionicons name="sunny" size={28} color={theme.colors.info} />
            </View>
            
            <View style={[styles.floatingIcon, styles.icon3, { backgroundColor: theme.colors.success + '20' }]}>
              <Ionicons name="leaf" size={28} color={theme.colors.success} />
            </View>
            
            <View style={[styles.floatingIcon, styles.icon4, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="star" size={24} color={theme.colors.primary} />
            </View>
          </View>
        </View>
        
        {/* Main content */}
        <View style={styles.content}>
          {/* Title section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Mind Haven</Text>
            <View style={[styles.titleUnderline, { backgroundColor: theme.colors.primary }]} />
          </View>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your daily mental wellness companion
          </Text>
        </View>
        
        {/* Buttons at bottom */}
        <View style={styles.buttonsContainer}>
          <PrimaryButton 
            label="Get Started" 
            onPress={() => navigation.navigate('SignIn')} 
          />
          <PrimaryButton 
            label="Create Account" 
            variant="secondary" 
            onPress={() => navigation.navigate('SignUp')} 
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  illustrationSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  illustrationContainer: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainIconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 5,
  },
  floatingIcon: {
    position: 'absolute',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon1: {
    width: 60,
    height: 60,
    top: 20,
    right: 10,
  },
  icon2: {
    width: 56,
    height: 56,
    top: 50,
    left: 0,
  },
  icon3: {
    width: 56,
    height: 56,
    bottom: 40,
    right: 20,
  },
  icon4: {
    width: 48,
    height: 48,
    bottom: 20,
    left: 30,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { 
    fontSize: 48, 
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  titleUnderline: {
    marginTop: 8,
    height: 4,
    width: 80,
    borderRadius: 2,
  },
  subtitle: { 
    fontSize: 17, 
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    gap: 12,
  },
});
