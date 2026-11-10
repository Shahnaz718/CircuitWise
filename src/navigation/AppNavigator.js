import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

import HomeScreen from '../screens/HomeScreen';
import ProblemListScreen from '../screens/ProblemListScreen';
import ProblemDetailScreen from '../screens/ProblemDetailScreen';
import StepsScreen from '../screens/StepsScreen';
import SafetyScreen from '../screens/SafetyScreen';
import SavedScreen from '../screens/SavedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  Home: ['home', 'home-outline'],
  Problems: ['list', 'list-outline'],
  Safety: ['shield-checkmark', 'shield-checkmark-outline'],
  Saved: ['heart', 'heart-outline'],
  More: ['ellipsis-horizontal-circle', 'ellipsis-horizontal-circle-outline'],
};

function Tabs() {
  const { colors } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.sub,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Problems" component={ProblemListScreen} />
      <Tab.Screen name="Safety" component={SafetyScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="More" component={AboutScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, dark } = useApp();
  const base = dark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, primary: colors.tabActive, background: colors.bg, card: colors.card, text: colors.ink, border: colors.line, notification: colors.high },
  };
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
        <Stack.Screen name="Steps" component={StepsScreen} />
        <Stack.Screen name="Tools" component={ToolsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
