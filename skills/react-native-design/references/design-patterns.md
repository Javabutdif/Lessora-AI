# React Native Design Patterns

## Styling

### StyleSheet and dynamic styles

Use `StyleSheet.create` for static styles and combine arrays for variants and states.

import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
title: { fontSize: 24, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
subtitle: { fontSize: 16, color: '#666666', lineHeight: 24 },
card: { padding: 16, borderRadius: 12 },
primary: { backgroundColor: '#6366f1' },
secondary: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
disabled: { opacity: 0.5 },
});

function Card({ variant, disabled, children }) {
return (
<View style={[
styles.card,
variant === 'primary' ? styles.primary : styles.secondary,
disabled && styles.disabled,
]}>
{children}
</View>
);
}

### Flexbox layout patterns

- Use `flexDirection`, `justifyContent`, `alignItems` for layout.
- Prefer `gap` and nested stacks for spacing when supported.
- Use `flex: 1` to fill available space in responsive screens.

## React Navigation

### Stack navigator

Use typed param lists and consistent screen options.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
Home: undefined;
Detail: { itemId: string };
Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
return (
<NavigationContainer>
<Stack.Navigator
initialRouteName="Home"
screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: '600' },
        }} >
<Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="Detail" component={DetailScreen} />
<Stack.Screen name="Settings" component={SettingsScreen} />
</Stack.Navigator>
</NavigationContainer>
);
}

### Bottom tab navigator

Keep icon mapping and theme colors centralized.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
return (
<Tab.Navigator screenOptions={({ route }) => ({
tabBarIcon: ({ focused, color, size }) => {
const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
Home: focused ? 'home' : 'home-outline',
Search: focused ? 'search' : 'search-outline',
Profile: focused ? 'person' : 'person-outline',
};
return <Ionicons name={icons[route.name]} size={size} color={color} />;
},
tabBarActiveTintColor: '#6366f1',
tabBarInactiveTintColor: '#9ca3af',
})}>
<Tab.Screen name="Home" component={HomeScreen} />
<Tab.Screen name="Search" component={SearchScreen} />
<Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
);
}

## Reanimated 3

### Shared values and animated styles

Keep animation logic in worklets and out of render logic.

import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function AnimatedBox() {
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
transform: [{ scale: scale.value }],
}));

return (
<Pressable onPress={() => { scale.value = withSpring(1.2, {}, () => { scale.value = withSpring(1); }); }}>
<Animated.View style={[styles.box, animatedStyle]} />
</Pressable>
);
}

### Gesture Handler integration

Use `GestureDetector` and avoid conflicts by composing gestures explicitly.

import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const gesture = Gesture.Pan()
.onUpdate((event) => { translateX.value = event.translationX; })
.onEnd(() => { translateX.value = withSpring(0); });

return (
<GestureDetector gesture={gesture}>
<Animated.View style={[styles.card, animatedStyle]} />
</GestureDetector>
);

### Layout animations

Use `Layout`, `FadeIn`, `FadeOut`, and `SlideIn` for list transitions.

<Animated.View entering={FadeIn.duration(300)} exiting={SlideOutRight.duration(300)} layout={Layout.springify()}>
<Text>{item.title}</Text>
</Animated.View>

## Platform-specific styling

Use `Platform.select` for shadows, fonts, and safe layout differences.

import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container: {
padding: 16,
...Platform.select({
ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
android: { elevation: 4 },
}),
},
});

## Layout components

Create reusable layout primitives such as `Container`, `VStack`, `HStack`, and `Spacer`.

## Best practices

- Use TypeScript for navigation and component props.
- Memoize components with `React.memo`, `useCallback`, and `useMemo`.
- Avoid inline styles for frequently rendered components.
- Use `SafeAreaView` and `useSafeAreaInsets`.
- Use `FlatList` for long lists and avoid mapping arrays inside `ScrollView`.

## Performance and animation safety

- Keep worklets small and deterministic.
- Use `runOnJS` only for side effects after animation completion.
- Cancel animations on unmount with `cancelAnimation`.
- Prefer native driver animated values via Reanimated.

## Common issues

- Gesture conflicts: use `GestureDetector` and explicit gesture composition.
- Navigation type errors: define explicit param lists.
- Animation jank: move heavy work off the main JS thread.
- Font loading: use `expo-font` or asset bundling.
- Safe area issues: test on notched devices and landscape.
