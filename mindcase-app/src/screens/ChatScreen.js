import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { sendMessage, createNewChat, getChatHistory, clearChat } from '../services/chatApi';

export default function ChatScreen({ navigation, route }) {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [chatId, setChatId] = useState(route.params?.chatId || null);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setInitialLoading(true);
      if (chatId) {
        // Load existing chat
        const response = await getChatHistory(chatId);
        if (response.success && response.data) {
          setMessages(response.data.messages || []);
        }
      } else {
        // Create new chat
        const response = await createNewChat();
        if (response.success && response.data) {
          setChatId(response.data._id);
          setMessages(response.data.messages || []);
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Set default welcome message on error
      setMessages([{
        role: 'assistant',
        content: "Hello! 👋 I'm MindBot, your wellness companion. I'm here to listen and support you. How are you feeling today?",
        timestamp: new Date()
      }]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendMessage(userMessage.content, chatId);
      
      if (response.success && response.data) {
        if (!chatId) {
          setChatId(response.data.chatId);
        }
        setMessages(prev => [...prev, response.data.message]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💙",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              if (chatId) {
                await clearChat(chatId);
              }
              initializeChat();
            } catch (error) {
              console.error('Clear chat error:', error);
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user';
    const isError = item.isError;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primaryDark} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
              : [
                  styles.assistantBubble,
                  { 
                    backgroundColor: isError ? theme.colors.danger + '20' : theme.colors.surface,
                    borderColor: isError ? theme.colors.danger : theme.colors.border,
                  },
                ],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? theme.colors.textOnPrimary : theme.colors.text },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.timestamp,
              { color: isUser ? theme.colors.textOnPrimary + '80' : theme.colors.textMuted },
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.avatar, styles.userAvatar, { backgroundColor: theme.colors.primaryDark }]}>
            <Ionicons name="person" size={16} color={theme.colors.textOnPrimary} />
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!loading) return null;

    return (
      <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}>
          <Ionicons name="sparkles" size={16} color={theme.colors.primaryDark} />
        </View>
        <View
          style={[
            styles.messageBubble,
            styles.assistantBubble,
            styles.typingBubble,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.typingDots}>
            <TypingDot delay={0} theme={theme} />
            <TypingDot delay={200} theme={theme} />
            <TypingDot delay={400} theme={theme} />
          </View>
        </View>
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Starting conversation...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textOnPrimary} />
        </Pressable>
        <View style={styles.headerContent}>
          <View style={[styles.headerAvatar, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primaryDark} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.textOnPrimary }]}>
              MindBot
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textOnPrimary + '80' }]}>
              Your Wellness Companion
            </Text>
          </View>
        </View>
        <Pressable onPress={handleClearChat} style={styles.menuButton}>
          <Ionicons name="trash-outline" size={22} color={theme.colors.textOnPrimary} />
        </Pressable>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `msg-${index}`}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: theme.colors.textSecondary }]}>
            Quick starts:
          </Text>
          <View style={styles.suggestions}>
            {[
              "I'm feeling anxious today",
              "Help me with stress",
              "I need motivation",
              "Let's do a breathing exercise"
            ].map((suggestion, index) => (
              <Pressable
                key={index}
                style={[styles.suggestionChip, { 
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border 
                }]}
                onPress={() => setInputText(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                  {suggestion}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { 
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border 
      }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            borderColor: theme.colors.border
          }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Share how you're feeling..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          maxLength={1000}
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? theme.colors.textOnPrimary : theme.colors.textMuted}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// Animated typing dot component
function TypingDot({ delay, theme }) {
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prev => prev === 0.3 ? 1 : 0.3);
    }, 600);

    const timeout = setTimeout(() => {
      setOpacity(1);
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <View
      style={[
        styles.typingDot,
        { backgroundColor: theme.colors.primary, opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    marginLeft: 8,
    marginRight: 0,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
