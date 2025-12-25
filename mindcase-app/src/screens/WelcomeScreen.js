import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
        {/* Logo section */}
        <View style={styles.illustrationSection}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Main content */}
        <View style={styles.content}>
          {/* Title section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Well Sync</Text>
            <View style={[styles.titleUnderline, { backgroundColor: theme.colors.primary }]} />
          </View>
          
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your daily wellness companion
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
          
          {/* Watermark at bottom */}
          <View style={styles.watermarkContainer}>
            <Image 
              source={require('../../assets/watermark.png')}
              style={styles.watermark}
              resizeMode="contain"
            />
          </View>
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
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 250,
    maxHeight: 250,
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
  watermarkContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
  },
  watermark: {
    width: 120,
    height: 40,
    opacity: 0.7,
  },
});
