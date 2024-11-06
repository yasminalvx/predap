import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useTheme } from '@/components/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { isDarkTheme } = useTheme();
  const colorScheme = isDarkTheme ? "dark" : "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
