import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { colors } from '@/lib/palette';

/** Original kid explorer avatar with a leaf hat (never a photo, to keep students' data private). */
export function Avatar({ size = 120, ring = colors.leafPale }: { size?: number; ring?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={58} fill={ring} />
      <Path d="M24 118 q4 -30 36 -30 q32 0 36 30z" fill={colors.teal} />
      <Path d="M48 90 l12 12 l12 -12" fill={colors.tealPale} />
      <Ellipse cx={60} cy={60} rx={25} ry={27} fill="#F2C29B" />
      <Path d="M34 58 q-2 -30 26 -30 q28 0 26 30 q-6 -14 -26 -16 q-20 2 -26 16z" fill="#3A2A22" />
      <Path d="M35 56 q-6 18 2 30 q-2 -14 4 -22z M85 56 q6 18 -2 30 q2 -14 -4 -22z" fill="#3A2A22" />
      <Path d="M52 30 q-4 -16 10 -22 q2 14 -10 22z" fill={colors.leaf} />
      <Path d="M62 30 q12 -12 24 -6 q-10 10 -24 6z" fill={colors.leafLight} />
      <Circle cx={51} cy={62} r={3.5} fill={colors.ink} />
      <Circle cx={69} cy={62} r={3.5} fill={colors.ink} />
      <Circle cx={52} cy={61} r={1.2} fill={colors.white} />
      <Circle cx={70} cy={61} r={1.2} fill={colors.white} />
      <Ellipse cx={45} cy={70} rx={4} ry={2.5} fill={colors.pink} />
      <Ellipse cx={75} cy={70} rx={4} ry={2.5} fill={colors.pink} />
      <Path d="M53 72 q7 7 14 0" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
