/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#9A4DFF';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    inputText: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E8E8E8', 
    underlayColor: '#E8E8E8'
  },
  dark: {
    text: '#ECEDEE',
    inputText: '#11181C',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2f3336',
    underlayColor: '#26212E'
  },
};
