import { useRouter } from 'expo-router';
import { Calendar, GraduationCap, Leaf, Pencil, Settings, Sprout, Sun, Trophy } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/art/Avatar';
import { Binhi } from '@/components/art/Binhi';
import { PlantArt } from '@/components/art/PlantArt';
import { ChunkyButton } from '@/components/ChunkyButton';
import { Screen, ScreenTitle } from '@/components/Screen';
import { PLANTS } from '@/data/plants';
import { displayName, stageFor, useGame } from '@/lib/game';
import { colors } from '@/lib/palette';

function formatJoined(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function Stat({ icon, bg, value, label }: { icon: ReactNode; bg: string; value: string; label: string }) {
  return (
    <View className="flex-1 items-center rounded-3xl bg-white py-3" style={{ borderBottomWidth: 5, borderBottomColor: colors.sandDark, minWidth: '45%' }}>
      <View className="h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
        {icon}
      </View>
      <Text className="mt-1 font-heading text-[24px] text-ink">{value}</Text>
      <Text className="font-medium text-[14px] text-muted">{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3 py-2.5">
      {icon}
      <Text className="w-20 font-semibold text-[16px] text-muted">{label}</Text>
      <Text className="flex-1 font-heading text-[17px] text-ink">{value}</Text>
    </View>
  );
}

/** Profile: who the student is, their Binhi, stats and garden. Options live in Settings (gear button). */
export default function Profile() {
  const router = useRouter();
  const { snapshot } = useGame();
  const { profile } = snapshot;
  const growth = stageFor(snapshot.leaves);
  const explored = PLANTS.filter((p) => snapshot.progress[p.id]);

  return (
    <Screen>
      <ScreenTitle
        title="Profile"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            hitSlop={8}
            onPress={() => router.push('/settings')}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white"
            style={{ borderBottomWidth: 4, borderBottomColor: colors.sandDark }}>
            <Settings size={24} color={colors.ink} strokeWidth={2.4} />
          </Pressable>
        }
      />

      <View className="mx-5 items-center rounded-3xl bg-white px-4 pb-4 pt-5" style={{ borderBottomWidth: 6, borderBottomColor: colors.sandDark }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Change your look" onPress={() => router.push('/edit-profile')}>
          <Avatar id={profile.avatar} size={112} />
          <View className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.leaf, borderWidth: 3, borderColor: colors.white }}>
            <Pencil size={15} color={colors.white} strokeWidth={3} />
          </View>
        </Pressable>
        <Text className="mt-2 font-heading text-[28px] text-ink">{displayName(profile)}</Text>
        <View className="mt-3 self-stretch rounded-2xl px-4" style={{ backgroundColor: colors.cream }}>
          <InfoRow icon={<GraduationCap size={22} color={colors.grape} />} label="Grade" value={profile.grade ? `Grade ${profile.grade}` : 'Not set'} />
          <InfoRow icon={<Calendar size={22} color={colors.skyDark} />} label="Joined" value={formatJoined(profile.joinedAt)} />
        </View>
        <View className="mt-3 self-stretch">
          <ChunkyButton label="EDIT PROFILE" size="md" variant="white" icon={<Pencil size={18} color={colors.ink} />} onPress={() => router.push('/edit-profile')} />
        </View>
      </View>

      {/* Binhi */}
      <View className="mx-5 mt-4 flex-row items-center gap-3 rounded-3xl p-4" style={{ backgroundColor: colors.leaf, borderBottomWidth: 6, borderBottomColor: colors.leafDark }}>
        <View className="rounded-2xl bg-white/25 p-1">
          <Binhi stage={growth.stage} size={70} />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-[14px] text-white/90">YOUR BINHI</Text>
          <Text className="font-heading text-[22px] text-white">Binhi is {growth.name}</Text>
          <Text className="font-medium text-[15px] text-white">{growth.next ? `${growth.toNext} leaves to grow` : 'Fully bloomed!'}</Text>
        </View>
      </View>

      <View className="mx-5 mt-4 flex-row flex-wrap gap-3">
        <Stat icon={<Leaf size={22} color={colors.white} />} bg={colors.leaf} value={String(snapshot.leaves)} label="Leaves" />
        <Stat icon={<Sun size={22} color={colors.white} />} bg={colors.coral} value={String(snapshot.daysVisited)} label="Days exploring" />
        <Stat icon={<Sprout size={22} color={colors.white} />} bg={colors.teal} value={`${explored.length}/${PLANTS.length}`} label="Plants found" />
        <Stat
          icon={<Trophy size={22} color={colors.ink} />}
          bg={colors.sun}
          value={snapshot.bestScore ? `${snapshot.bestScore.score}/${snapshot.bestScore.total}` : '–'}
          label="Best quiz"
        />
      </View>

      {/* Garden */}
      <Text className="mb-3 mt-7 px-5 font-heading text-[22px] text-ink">My garden</Text>
      <View className="mx-5 flex-row flex-wrap gap-3">
        {PLANTS.map((p) => {
          const has = Boolean(snapshot.progress[p.id]);
          return (
            <View
              key={p.id}
              accessibilityLabel={has ? p.name : 'Empty garden spot'}
              className="items-center justify-center rounded-3xl"
              style={{
                width: '30%',
                flexGrow: 1,
                height: 104,
                backgroundColor: has ? p.theme.pale : 'transparent',
                borderWidth: 2.5,
                borderStyle: has ? 'solid' : 'dashed',
                borderColor: has ? p.theme.main : colors.sandDeep,
              }}>
              {has ? <PlantArt plantId={p.id} size={84} variant="compact" /> : <Text className="font-heading text-[30px] text-faint">?</Text>}
            </View>
          );
        })}
      </View>

    </Screen>
  );
}
