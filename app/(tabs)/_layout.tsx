import Icons from '@/components/Icons';
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
          tabBarIcon: ({ focused }) => (
            <Icons name={focused ? 'home-active' : 'home-menu'} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ focused }) => (
            <Icons name={focused ? 'settings-active' : 'settings'} />
          ),
        }}
      />
    </Tabs>
  );
}
