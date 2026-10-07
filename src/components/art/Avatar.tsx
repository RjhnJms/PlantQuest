import type { ReactNode } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/palette';

type Hair = 'short' | 'spiky' | 'curly' | 'sidePart' | 'buzz' | 'long' | 'pigtails' | 'bun' | 'bob' | 'braid';
type Accessory = 'none' | 'cap' | 'glasses' | 'leafHat' | 'bow' | 'flower';

type AvatarLook = {
  id: string;
  name: string;
  group: 'boys' | 'girls';
  skin: string;
  hair: Hair;
  hairColor: string;
  shirt: string;
  ring: string;
  accessory: Accessory;
  accent?: string;
};

const SKIN = { light: '#F2C29B', fair: '#E8B98F', tan: '#E0AC7E', medium: '#C68A5E', brown: '#A86E48', deep: '#8D5A3B' };
const HAIR = { black: '#1E1410', darkBrown: '#2B1D16', brown: '#3A2A22', chestnut: '#5A3A22' };

/** Original avatars drawn for PlantQuest. Kids pick a drawing, never a photo, to keep their data private. */
export const AVATARS: AvatarLook[] = [
  { id: 'b1', name: 'Leo', group: 'boys', skin: SKIN.medium, hair: 'short', hairColor: HAIR.darkBrown, shirt: colors.skyDark, ring: colors.skyPale, accessory: 'cap', accent: colors.coral },
  { id: 'b2', name: 'Paolo', group: 'boys', skin: SKIN.fair, hair: 'spiky', hairColor: HAIR.brown, shirt: colors.leaf, ring: colors.leafPale, accessory: 'none' },
  { id: 'b3', name: 'Marco', group: 'boys', skin: SKIN.deep, hair: 'curly', hairColor: HAIR.black, shirt: colors.sun, ring: colors.sunPale, accessory: 'glasses' },
  { id: 'b4', name: 'Jun', group: 'boys', skin: SKIN.light, hair: 'sidePart', hairColor: HAIR.chestnut, shirt: colors.grape, ring: colors.grapePale, accessory: 'leafHat' },
  { id: 'b5', name: 'Miko', group: 'boys', skin: SKIN.brown, hair: 'buzz', hairColor: HAIR.darkBrown, shirt: colors.teal, ring: colors.tealPale, accessory: 'none' },
  { id: 'b6', name: 'Rafa', group: 'boys', skin: SKIN.tan, hair: 'short', hairColor: HAIR.black, shirt: colors.coral, ring: colors.coralPale, accessory: 'glasses' },
  { id: 'g1', name: 'Lia', group: 'girls', skin: SKIN.light, hair: 'long', hairColor: HAIR.brown, shirt: colors.teal, ring: colors.leafPale, accessory: 'leafHat' },
  { id: 'g2', name: 'Bea', group: 'girls', skin: SKIN.medium, hair: 'pigtails', hairColor: HAIR.darkBrown, shirt: colors.pink, ring: colors.pinkPale, accessory: 'bow', accent: colors.pinkDark },
  { id: 'g3', name: 'Tala', group: 'girls', skin: SKIN.deep, hair: 'bun', hairColor: HAIR.black, shirt: colors.sun, ring: colors.sunPale, accessory: 'flower', accent: colors.coral },
  { id: 'g4', name: 'Mira', group: 'girls', skin: SKIN.fair, hair: 'bob', hairColor: HAIR.chestnut, shirt: colors.grape, ring: colors.grapePale, accessory: 'glasses' },
  { id: 'g5', name: 'Rosa', group: 'girls', skin: SKIN.brown, hair: 'braid', hairColor: HAIR.darkBrown, shirt: colors.leaf, ring: colors.leafPale, accessory: 'flower', accent: colors.white },
  { id: 'g6', name: 'Ana', group: 'girls', skin: SKIN.tan, hair: 'long', hairColor: HAIR.black, shirt: colors.coral, ring: colors.coralPale, accessory: 'bow', accent: colors.sun },
];

export const DEFAULT_AVATAR = 'g1';

export function getAvatar(id: string | null | undefined): AvatarLook {
  return AVATARS.find((a) => a.id === id) ?? AVATARS.find((a) => a.id === DEFAULT_AVATAR)!;
}

export function Avatar({ id, size = 120, ring }: { id?: string | null; size?: number; ring?: string }) {
  const look = getAvatar(id);
  const clipId = `avatar-clip-${look.id}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx={60} cy={60} r={58} />
        </ClipPath>
      </Defs>
      <Circle cx={60} cy={60} r={58} fill={ring ?? look.ring} />
      <G clipPath={`url(#${clipId})`}>
        <HairBack look={look} />
        {/* Shirt and neck */}
        <Path d="M22 122 q4 -32 38 -32 q34 0 38 32z" fill={look.shirt} />
        <Path d="M50 90 q10 10 20 0" fill={colors.white} opacity={0.5} />
        <Rect x={53} y={80} width={14} height={12} rx={5} fill={look.skin} />
        {/* Ears and face */}
        <Ellipse cx={35} cy={62} rx={5} ry={7} fill={look.skin} />
        <Ellipse cx={85} cy={62} rx={5} ry={7} fill={look.skin} />
        <Ellipse cx={60} cy={60} rx={25} ry={27} fill={look.skin} />
        <HairFront look={look} />
        <Face />
        <AccessoryLayer look={look} />
      </G>
    </Svg>
  );
}

function Face() {
  return (
    <G>
      <Circle cx={51} cy={63} r={3.5} fill={colors.ink} />
      <Circle cx={69} cy={63} r={3.5} fill={colors.ink} />
      <Circle cx={52} cy={62} r={1.2} fill={colors.white} />
      <Circle cx={70} cy={62} r={1.2} fill={colors.white} />
      <Ellipse cx={45} cy={71} rx={4} ry={2.5} fill={colors.pink} opacity={0.8} />
      <Ellipse cx={75} cy={71} rx={4} ry={2.5} fill={colors.pink} opacity={0.8} />
      <Path d="M53 73 q7 7 14 0" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </G>
  );
}

/** Hair drawn behind the head (long styles). */
function HairBack({ look }: { look: AvatarLook }) {
  const c = look.hairColor;
  switch (look.hair) {
    case 'long':
      return <Path d="M33 58 q0 -32 27 -32 q27 0 27 32 v40 q-7 6 -14 0 v-36 h-26 v36 q-7 6 -14 0z" fill={c} />;
    case 'bob':
      return <Path d="M32 60 q0 -34 28 -34 q28 0 28 34 v22 q-6 5 -12 0 v-20 h-32 v20 q-6 5 -12 0z" fill={c} />;
    case 'braid':
      return (
        <G>
          {[0, 1, 2, 3].map((i) => (
            <Ellipse key={i} cx={84 - i} cy={78 + i * 10} rx={6} ry={6.5} fill={c} />
          ))}
          <Circle cx={81} cy={118} r={4} fill={look.accent ?? colors.coral} />
        </G>
      );
    case 'pigtails':
      return (
        <G>
          <Ellipse cx={28} cy={70} rx={9} ry={14} fill={c} />
          <Ellipse cx={92} cy={70} rx={9} ry={14} fill={c} />
        </G>
      );
    case 'bun':
      return <Circle cx={60} cy={26} r={12} fill={c} />;
    default:
      return null;
  }
}

/** Hair drawn over the forehead. */
function HairFront({ look }: { look: AvatarLook }) {
  const c = look.hairColor;
  const shapes: Record<Hair, ReactNode> = {
    short: <Path d="M34 58 q-2 -30 26 -30 q28 0 26 30 q-4 -13 -26 -15 q-22 2 -26 15z" fill={c} />,
    spiky: <Path d="M34 56 l1 -17 l9 6 l4 -15 l8 9 l4 -13 l6 13 l8 -9 l4 15 l9 -6 l1 17 q-8 -12 -27 -13 q-19 1 -27 13z" fill={c} />,
    curly: (
      <G fill={c}>
        {[
          [38, 50], [44, 40], [53, 34], [63, 33], [73, 37], [80, 45], [84, 54], [36, 58],
        ].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={9} />
        ))}
      </G>
    ),
    sidePart: <Path d="M34 60 q-3 -32 26 -32 q30 0 26 30 q-10 -2 -20 -14 q-12 12 -32 16z" fill={c} />,
    buzz: <Path d="M36 54 q2 -24 24 -24 q22 0 24 24 q-6 -8 -24 -9 q-18 1 -24 9z" fill={c} opacity={0.85} />,
    long: <Path d="M34 58 q-2 -30 26 -30 q28 0 26 30 q-6 -14 -26 -16 q-20 2 -26 16z" fill={c} />,
    bob: <Path d="M34 62 q-3 -34 26 -34 q29 0 26 34 q-6 -16 -12 -18 q-6 6 -28 6 q-8 2 -12 12z" fill={c} />,
    pigtails: <Path d="M35 56 q-1 -28 25 -28 q26 0 25 28 q-5 -12 -25 -13 q-20 1 -25 13z" fill={c} />,
    bun: <Path d="M35 56 q-1 -28 25 -28 q26 0 25 28 q-5 -12 -25 -13 q-20 1 -25 13z" fill={c} />,
    braid: <Path d="M34 58 q-2 -30 26 -30 q28 0 26 30 q-10 -4 -14 -14 q-14 10 -38 14z" fill={c} />,
  };
  return <>{shapes[look.hair]}</>;
}

function AccessoryLayer({ look }: { look: AvatarLook }) {
  switch (look.accessory) {
    case 'cap':
      return (
        <G>
          <Path d="M34 48 q0 -22 26 -22 q26 0 26 22z" fill={look.accent ?? colors.coral} />
          <Path d="M58 46 h34 q4 0 2 4 h-36z" fill={look.accent ?? colors.coral} />
          <Path d="M58 46 h34 q4 0 2 4 h-36z" fill={colors.ink} opacity={0.15} />
          <Circle cx={60} cy={27} r={3} fill={colors.white} />
        </G>
      );
    case 'glasses':
      return (
        <G stroke={colors.ink} strokeWidth={2.2} fill={colors.white} fillOpacity={0.25}>
          <Circle cx={51} cy={63} r={8} />
          <Circle cx={69} cy={63} r={8} />
          <Path d="M59 63 h2" />
        </G>
      );
    case 'leafHat':
      return (
        <G>
          <Path d="M52 31 q-4 -16 10 -22 q2 14 -10 22z" fill={colors.leaf} />
          <Path d="M62 31 q12 -12 24 -6 q-10 10 -24 6z" fill={colors.leafLight} />
        </G>
      );
    case 'bow':
      return (
        <G fill={look.accent ?? colors.pink}>
          <Path d="M70 32 l-12 -8 v16z" />
          <Path d="M70 32 l12 -8 v16z" />
          <Circle cx={70} cy={32} r={4} />
        </G>
      );
    case 'flower':
      return (
        <G>
          {[0, 72, 144, 216, 288].map((deg) => (
            <Ellipse key={deg} cx={80} cy={34} rx={4} ry={6} fill={look.accent ?? colors.coral} transform={`rotate(${deg} 80 40)`} />
          ))}
          <Circle cx={80} cy={40} r={3.5} fill={colors.sun} />
        </G>
      );
    default:
      return null;
  }
}
