import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const TypingIndicator = () => {
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 400,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]);
    };

    const mainAnimation = Animated.loop(
      Animated.stagger(150, animations.map(createAnimation))
    );

    mainAnimation.start();

    return () => mainAnimation.stop();
  }, [animations]);

  const getDotStyle = (animatedValue: Animated.Value) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View key={index} style={[styles.dot, getDotStyle(anim)]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4A056',
    marginHorizontal: 3,
  },
});

export default TypingIndicator;

