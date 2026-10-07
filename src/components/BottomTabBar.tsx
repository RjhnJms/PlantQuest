import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { Home, Puzzle, Sprout, User } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { feedback } from '@/lib/feedback';
import { colors } from '@/lib/palette';

const TABS = {
  index: { label: 'Home', Icon: Home, color: colors.leaf, edge: colors.leafDark },
  plants: { label: 'Plants', Icon: Sprout, color: colors.teal, edge: colors.tealDark },
  quiz: { label: 'Quiz', Icon: Puzzle, color: colors.grape, edge: colors.grapeDark },
  profile: { label: 'Profile', Icon: User, color: colors.coral, edge: colors.coralDark },
} as const;

/** Each tab has its own color; the active one becomes a chunky colored tile. */
export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row justify-around bg-white px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10), borderTopWidth: 2, borderTopColor: colors.sand }}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name as keyof typeof TABS];
        if (!tab) return null;
        const focused = state.index === index;
        const { Icon } = tab;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                feedback.tap();
                navigation.navigate(route.name);
              }
            }}
            className="min-w-[72px] items-center">
            <View
              style={{
                width: 52,
                height: 40,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? tab.color : 'transparent',
                borderBottomWidth: focused ? 4 : 0,
                borderBottomColor: tab.edge,
              }}>
              <Icon size={24} color={focused ? colors.white : colors.faint} strokeWidth={2.5} />
            </View>
            <Text className="mt-0.5 font-semibold text-[12px]" style={{ color: focused ? tab.edge : colors.faint }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
