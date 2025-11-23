import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../theme';
import { register, login } from '../redux/slices/authSlice';

// Validation schema
const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function SignUpScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSignUp = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      
      // Register user (simulation/local) – do NOT auto-login
      await dispatch(register(formData)).unwrap();

      // Show success message then redirect to SignIn
      Alert.alert(
        'Account Created',
        'Your account has been created successfully. Please sign in.',
        [
          { text: 'OK', onPress: () => navigation.replace('SignIn') }
        ]
      );
    } catch (err) {
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        Alert.alert('Registration Failed', err || 'Please try again');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerIcon}>
            <Ionicons name="person-add" size={48} color="#fff" />
          </View>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>Create Account</Text>
          <Text style={[styles.headerSubtitle, { color: '#fff', opacity: 0.9 }]}>Join us and start your wellness journey today</Text>
        </LinearGradient>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Username</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: errors.username ? theme.colors.danger : theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Choose a username" 
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]} 
                autoCapitalize="none"
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
              />
            </View>
            {errors.username && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>First Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: errors.firstName ? theme.colors.danger : theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Enter your first name" 
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]} 
                value={formData.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
              />
            </View>
            {errors.firstName && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errors.firstName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Last Name</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: errors.lastName ? theme.colors.danger : theme.colors.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Enter your last name" 
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]} 
                value={formData.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
              />
            </View>
            {errors.lastName && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errors.lastName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: errors.email ? theme.colors.danger : theme.colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Enter your email" 
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]} 
                autoCapitalize="none"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
              />
            </View>
            {errors.email && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: errors.password ? theme.colors.danger : theme.colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                placeholder="Create a password" 
                placeholderTextColor={theme.colors.textMuted}
                style={[styles.input, { color: theme.colors.text }]} 
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
              />
            </View>
            {errors.password && <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errors.password}</Text>}
          </View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
              By signing up, you agree to our{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <PrimaryButton label="Create Account" onPress={handleSignUp} />
            )}
          </View>

          <View style={styles.signinContainer}>
            <Text style={[styles.signinText, { color: theme.colors.textSecondary }]}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
              <Text style={[styles.signinLink, { color: theme.colors.primary }]}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  signinText: {
    fontSize: 15,
    fontWeight: '500',
  },
  signinLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
