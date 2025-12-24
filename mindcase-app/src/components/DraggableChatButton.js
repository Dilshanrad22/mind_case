import React, { useRef, useState } from 'react';
import { 
  Animated, 
  PanResponder, 
  StyleSheet, 
  Dimensions, 
  Pressable,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN = 16;

export default function DraggableChatButton({ onPress, visible = true }) {
  const theme = useTheme();
  const pan = useRef(new Animated.ValueXY({ 
    x: SCREEN_WIDTH - BUTTON_SIZE - MARGIN, 
    y: SCREEN_HEIGHT - BUTTON_SIZE - 120 // Above tab bar
  })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to move if actually moving
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
        
        // Scale up animation
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        setIsDragging(false);

        // Scale back animation
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        // Snap to edges
        let finalX = pan.x._value;
        let finalY = pan.y._value;

        // Constrain to screen bounds
        finalX = Math.max(MARGIN, Math.min(finalX, SCREEN_WIDTH - BUTTON_SIZE - MARGIN));
        finalY = Math.max(MARGIN + 50, Math.min(finalY, SCREEN_HEIGHT - BUTTON_SIZE - 120));

        // Snap to nearest edge (left or right)
        if (finalX < SCREEN_WIDTH / 2) {
          finalX = MARGIN;
        } else {
          finalX = SCREEN_WIDTH - BUTTON_SIZE - MARGIN;
        }

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 5,
        }).start();

        // If minimal movement, treat as tap
        if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          onPress && onPress();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable 
        onPress={() => !isDragging && onPress && onPress()}
        style={styles.touchable}
      >
        <LinearGradient
          colors={theme.colors.goldGradient || ['#FFD700', '#FFE44D', '#FFF59D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="chatbubble-ellipses" size={28} color={theme.colors.primaryDark} />
          </View>
          {/* Glow effect */}
          <View style={[styles.glow, { backgroundColor: theme.colors.secondary }]} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 9999,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    width: BUTTON_SIZE - 8,
    height: BUTTON_SIZE - 8,
    borderRadius: (BUTTON_SIZE - 8) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: BUTTON_SIZE + 20,
    height: BUTTON_SIZE + 20,
    borderRadius: (BUTTON_SIZE + 20) / 2,
    opacity: 0.2,
    zIndex: -1,
  },
});
