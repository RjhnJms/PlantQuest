import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import type { PartKey } from '@/data/plants';
import { colors } from '@/lib/palette';

type Props = {
  plantId: string;
  size?: number;
  /** Full shows the soil cut-away with roots; compact crops at the ground for cards and thumbnails. */
  variant?: 'full' | 'compact';
  highlight?: PartKey | null;
  /** When set, every part is tappable. */
  onPartPress?: (part: PartKey) => void;
  /** Used by "tap the part" feedback: dim everything except the highlighted part. */
  dimOthers?: boolean;
};

const OUTLINE = colors.ink;

/** Original plant illustrations. Each plant part is its own group so it can be tapped and highlighted. */
export function PlantArt({ plantId, size = 200, variant = 'full', highlight = null, onPartPress, dimOthers = false }: Props) {
  const full = variant === 'full';
  const viewBox = full ? '0 0 200 240' : '0 10 200 175';
  const height = full ? size * 1.2 : size * 0.875;

  const part = (key: PartKey, children: ReactNode) => {
    const active = highlight === key;
    // react-native-svg's onPress becomes touch-responder props, which browsers reject; web uses a plain click.
    const press = onPartPress ? () => onPartPress(key) : undefined;
    const handler = Platform.OS === 'web' ? ({ onClick: press } as object) : { onPress: press };
    return (
      <G key={key} {...handler} opacity={dimOthers && highlight && !active ? 0.3 : 1}>
        {children}
      </G>
    );
  };

  const Draw = DRAWINGS[plantId] ?? DRAWINGS.sunflower;

  return (
    <Svg width={size} height={height} viewBox={viewBox}>
      {full ? (
        <G>
          <Rect x={0} y={172} width={200} height={68} fill="#E9D2AE" />
          <Path d="M0 174 q50 -10 100 0 t100 0 v6 h-200z" fill={colors.soil} />
          <Circle cx={30} cy={210} r={3} fill="#D7B88E" />
          <Circle cx={170} cy={200} r={4} fill="#D7B88E" />
          <Circle cx={150} cy={226} r={2.5} fill="#D7B88E" />
        </G>
      ) : (
        <Ellipse cx={100} cy={176} rx={60} ry={9} fill={colors.soil} />
      )}
      {Draw({ part, highlight, full })}
    </Svg>
  );
}

type DrawArgs = {
  part: (key: PartKey, children: ReactNode) => ReactNode;
  highlight: PartKey | null;
  full: boolean;
};

/** Soft glow behind a highlighted part. */
function Glow({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <G opacity={0.45}>{children}</G>;
}

function petals(cx: number, cy: number, count: number, rx: number, ry: number, dist: number, fill: string) {
  return Array.from({ length: count }, (_, i) => {
    const deg = (360 / count) * i;
    return (
      <Ellipse
        key={i}
        cx={cx}
        cy={cy - dist}
        rx={rx}
        ry={ry}
        fill={fill}
        stroke={OUTLINE}
        strokeWidth={1.5}
        transform={`rotate(${deg} ${cx} ${cy})`}
      />
    );
  });
}

function roots(color: string, paths: string[], width = 3) {
  return paths.map((d, i) => (
    <Path key={i} d={d} stroke={color} strokeWidth={i === 0 ? width + 1 : width} strokeLinecap="round" fill="none" />
  ));
}

const ROOT = '#9A6A3A';

const DRAWINGS: Record<string, (a: DrawArgs) => ReactNode> = {
  sunflower: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={205} rx={42} ry={30} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 q2 26 -2 56', 'M100 182 q-16 14 -34 30', 'M100 182 q18 12 36 26', 'M86 204 l-12 6', 'M118 198 l12 -4'])}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={88} y={80} width={24} height={98} rx={12} fill={colors.sun} />
          </Glow>
          <Path d="M100 86 v90" stroke={colors.leafDark} strokeWidth={8} strokeLinecap="round" />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={72} cy={128} rx={34} ry={22} fill={colors.sun} />
            <Ellipse cx={128} cy={146} rx={34} ry={22} fill={colors.sun} />
          </Glow>
          <Path d="M100 138 q-40 -4 -52 -30 q34 0 52 28z" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M98 136 q-22 -8 -40 -24" stroke={colors.leafDark} strokeWidth={1.5} fill="none" />
          <Path d="M100 156 q40 -4 52 -30 q-34 0 -52 28z" fill={colors.leafLight} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M102 154 q22 -8 40 -24" stroke={colors.leafDark} strokeWidth={1.5} fill="none" />
        </G>,
      )}
      {part(
        'flower',
        <G>
          <Glow show={highlight === 'flower'}>
            <Circle cx={100} cy={62} r={50} fill={colors.sun} />
          </Glow>
          {petals(100, 62, 14, 8, 17, 28, colors.sun)}
          <Circle cx={100} cy={62} r={21} fill="#7A4A1E" stroke={OUTLINE} strokeWidth={1.5} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Circle key={i} cx={100 + 11 * Math.cos(i * 0.785)} cy={62 + 11 * Math.sin(i * 0.785)} r={2} fill="#5A3412" />
          ))}
          <Circle cx={100} cy={62} r={3} fill="#5A3412" />
        </G>,
      )}
    </G>
  ),

  fern: ({ part, highlight, full }) => {
    const frond = (d: string, leaflets: [number, number, number][], fill: string) => (
      <G>
        <Path d={d} stroke={colors.tealDark} strokeWidth={3} fill="none" strokeLinecap="round" />
        {leaflets.map(([x, y, r], i) => (
          <Ellipse key={i} cx={x} cy={y} rx={9} ry={4.5} fill={fill} stroke={OUTLINE} strokeWidth={1} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </G>
    );
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Ellipse cx={100} cy={200} rx={40} ry={24} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 q-4 20 0 40', 'M100 178 q-20 8 -32 22', 'M100 178 q22 8 32 20', 'M92 190 q-6 14 -16 22', 'M108 190 q8 12 18 20'], 2)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Ellipse cx={100} cy={160} rx={22} ry={20} fill={colors.sun} />
            </Glow>
            <Path d="M100 176 v-30" stroke={colors.tealDark} strokeWidth={7} strokeLinecap="round" />
            <Path d="M100 160 q-8 -2 -12 -10 M100 156 q8 -2 12 -10" stroke={colors.tealDark} strokeWidth={4} strokeLinecap="round" fill="none" />
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={90} rx={90} ry={66} fill={colors.sun} />
            </Glow>
            {frond('M98 150 q-30 -40 -76 -44', [[80, 132, -50], [70, 122, -40], [58, 114, -25], [46, 109, -15], [34, 107, 0], [86, 120, 40], [74, 110, 30], [60, 102, 20]], colors.teal)}
            {frond('M102 150 q30 -40 76 -44', [[120, 132, 50], [130, 122, 40], [142, 114, 25], [154, 109, 15], [166, 107, 0], [114, 120, -40], [126, 110, -30], [140, 102, -20]], colors.teal)}
            {frond('M100 148 q-4 -60 -10 -110', [[92, 128, -70], [108, 126, 70], [90, 108, -70], [106, 104, 70], [88, 88, -70], [102, 82, 70], [88, 66, -70], [100, 60, 70], [90, 46, -60]], '#5ED6C8')}
          </G>,
        )}
        {part(
          'spores',
          <G>
            <Glow show={highlight === 'spores'}>
              <Circle cx={56} cy={116} r={22} fill={colors.sun} />
            </Glow>
            {[[46, 113], [56, 118], [66, 124], [52, 108], [62, 112]].map(([x, y], i) => (
              <Circle key={i} cx={x} cy={y + 4} r={2.6} fill="#C46A1A" stroke={OUTLINE} strokeWidth={0.6} />
            ))}
          </G>,
        )}
      </G>
    );
  },

  cactus: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={190} rx={80} ry={18} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 178 v14', 'M96 180 q-30 6 -70 8', 'M104 180 q30 6 70 8', 'M90 182 q-20 10 -44 14', 'M110 182 q20 10 44 14', 'M60 186 l-8 6', 'M140 186 l8 6'], 2.5)}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={70} y={44} width={60} height={136} rx={30} fill={colors.sun} />
          </Glow>
          <Path d="M58 120 v-30 a12 12 0 0 1 24 0 v30z" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M58 118 q0 22 24 22" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M142 104 v-24 a11 11 0 0 0 -22 0 v24z" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M142 102 q0 22 -22 22" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Rect x={80} y={54} width={40} height={124} rx={20} fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M93 64 v108 M107 64 v108" stroke={colors.leafDark} strokeWidth={2} opacity={0.5} />
          <Rect x={86} y={60} width={6} height={60} rx={3} fill={colors.white} opacity={0.25} />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Rect x={52} y={50} width={96} height={130} rx={30} fill={colors.sun} opacity={0.6} />
          </Glow>
          {[
            [86, 80], [114, 96], [86, 112], [114, 128], [86, 144], [114, 160], [100, 70], [64, 100], [136, 88], [100, 150],
          ].map(([x, y], i) => (
            <G key={i}>
              <Line x1={x} y1={y} x2={x - 6} y2={y - 5} stroke={OUTLINE} strokeWidth={1.4} strokeLinecap="round" />
              <Line x1={x} y1={y} x2={x + 6} y2={y - 5} stroke={OUTLINE} strokeWidth={1.4} strokeLinecap="round" />
              <Line x1={x} y1={y} x2={x} y2={y - 7} stroke={OUTLINE} strokeWidth={1.4} strokeLinecap="round" />
            </G>
          ))}
        </G>,
      )}
      {part(
        'flower',
        <G>
          <Glow show={highlight === 'flower'}>
            <Circle cx={100} cy={48} r={22} fill={colors.sun} />
          </Glow>
          {petals(100, 50, 6, 5, 9, 8, colors.pink)}
          <Circle cx={100} cy={50} r={4.5} fill={colors.sun} stroke={OUTLINE} strokeWidth={1} />
        </G>,
      )}
    </G>
  ),

  rose: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={204} rx={40} ry={28} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 q-2 26 2 52', 'M100 182 q-18 10 -30 28', 'M100 182 q18 10 32 24', 'M88 200 l-10 10', 'M114 196 l12 4'])}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={86} y={66} width={28} height={112} rx={14} fill={colors.sun} />
          </Glow>
          <Path d="M100 74 q4 50 0 102" stroke={colors.leafDark} strokeWidth={6} strokeLinecap="round" fill="none" />
          {[[102, 96, 1], [98, 122, -1], [102, 146, 1], [98, 164, -1]].map(([x, y, s], i) => (
            <Path key={i} d={`M${x} ${y} l${7 * s} -3 l${-7 * s} -5z`} fill={colors.leafDark} stroke={OUTLINE} strokeWidth={1} />
          ))}
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={74} cy={112} rx={30} ry={18} fill={colors.sun} />
            <Ellipse cx={128} cy={136} rx={30} ry={18} fill={colors.sun} />
          </Glow>
          <Path d="M100 116 q-14 -18 -44 -12 q2 4 -2 6 q6 4 2 7 q22 12 44 -1z" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M100 116 l-38 -6" stroke={colors.leafDark} strokeWidth={1.2} />
          <Path d="M100 140 q14 -18 44 -12 q-2 4 2 6 q-6 4 -2 7 q-22 12 -44 -1z" fill={colors.leafLight} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M100 140 l38 -6" stroke={colors.leafDark} strokeWidth={1.2} />
        </G>,
      )}
      {part(
        'flower',
        <G>
          <Glow show={highlight === 'flower'}>
            <Circle cx={100} cy={56} r={38} fill={colors.sun} />
          </Glow>
          <Path d="M86 74 q-6 8 -14 6 q8 -4 10 -10z M114 74 q6 8 14 6 q-8 -4 -10 -10z" fill={colors.leaf} stroke={OUTLINE} strokeWidth={1.2} />
          <Circle cx={100} cy={56} r={26} fill={colors.rose} stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M80 52 q20 -26 40 0 q-20 18 -40 0z" fill="#FF7A8C" stroke={OUTLINE} strokeWidth={1.2} />
          <Path d="M88 52 q12 -16 24 0 q-12 10 -24 0z" fill="#E8435A" stroke={OUTLINE} strokeWidth={1.2} />
          <Path d="M94 52 q6 -8 12 0" stroke={OUTLINE} strokeWidth={1.2} fill="none" />
          <Path d="M76 62 q24 20 48 0" stroke={OUTLINE} strokeWidth={1.2} fill="none" />
        </G>,
      )}
    </G>
  ),

  mango: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={206} rx={50} ry={30} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 v58', 'M100 180 q-24 8 -46 26', 'M100 180 q24 8 46 22', 'M100 196 q-14 8 -22 22', 'M100 196 q14 6 24 20'], 3.5)}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={82} y={92} width={36} height={88} rx={14} fill={colors.sun} />
          </Glow>
          <Path d="M90 178 q4 -40 2 -80 h16 q-2 40 2 80z" fill="#9A6A3A" stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M96 100 q-14 -10 -28 -16 M104 100 q14 -10 30 -14" stroke="#9A6A3A" strokeWidth={6} strokeLinecap="round" fill="none" />
          <Path d="M97 120 q2 20 0 44 M104 112 q-1 14 1 26" stroke="#7A4E28" strokeWidth={1.5} fill="none" />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={100} cy={64} rx={92} ry={56} fill={colors.sun} />
          </Glow>
          <Ellipse cx={100} cy={66} rx={80} ry={46} fill={colors.leafDark} stroke={OUTLINE} strokeWidth={1.5} />
          <Circle cx={56} cy={66} r={30} fill={colors.leaf} />
          <Circle cx={96} cy={44} r={34} fill={colors.leaf} />
          <Circle cx={142} cy={62} r={30} fill={colors.leaf} />
          <Circle cx={110} cy={82} r={26} fill={colors.leafLight} />
          {[[60, 52, -30], [92, 30, 10], [138, 48, 30], [78, 80, -10], [124, 88, 20], [150, 76, 40]].map(([x, y, r], i) => (
            <Ellipse key={i} cx={x} cy={y} rx={10} ry={4} fill={colors.leafLight} transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </G>,
      )}
      {part(
        'fruit',
        <G>
          <Glow show={highlight === 'fruit'}>
            <Circle cx={70} cy={98} r={16} fill={colors.sun} />
            <Circle cx={134} cy={100} r={16} fill={colors.sun} />
            <Circle cx={104} cy={108} r={14} fill={colors.sun} />
          </Glow>
          {[[70, 98], [134, 100], [104, 108]].map(([x, y], i) => (
            <G key={i}>
              <Line x1={x} y1={y - 14} x2={x} y2={y - 8} stroke={colors.leafDark} strokeWidth={2} />
              <Ellipse cx={x} cy={y} rx={8} ry={10} fill={i === 2 ? colors.sun : '#FFB23F'} stroke={OUTLINE} strokeWidth={1.4} />
              <Ellipse cx={x - 3} cy={y - 3} rx={2} ry={3} fill={colors.white} opacity={0.5} />
            </G>
          ))}
        </G>,
      )}
    </G>
  ),

  sampaguita: ({ part, highlight, full }) => {
    const flower = (x: number, y: number, k: number) => (
      <G key={k}>
        {petals(x, y, 6, 3.6, 7, 6, colors.white)}
        <Circle cx={x} cy={y} r={2.8} fill={colors.sun} />
      </G>
    );
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Ellipse cx={100} cy={202} rx={40} ry={26} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 q2 22 -2 46', 'M100 180 q-16 10 -30 24', 'M100 180 q18 8 30 22', 'M90 196 l-10 8', 'M110 194 l10 6'], 2.5)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Ellipse cx={100} cy={120} rx={46} ry={60} fill={colors.sun} />
            </Glow>
            <Path
              d="M100 176 q-2 -40 -24 -80 M100 176 q2 -50 26 -92 M100 150 q-6 -50 0 -100 M86 120 q-20 -6 -34 -20 M116 112 q20 -4 34 -18"
              stroke="#6B8F3A"
              strokeWidth={3.5}
              strokeLinecap="round"
              fill="none"
            />
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={100} rx={84} ry={62} fill={colors.sun} />
            </Glow>
            {[
              [70, 110, -40], [130, 104, 40], [62, 92, -20], [140, 86, 20], [90, 70, -30], [112, 64, 30], [96, 128, -10],
              [108, 138, 15], [52, 104, -60], [150, 98, 60], [80, 140, -20], [122, 124, 30],
            ].map(([x, y, r], i) => (
              <G key={i}>
                <Ellipse cx={x} cy={y} rx={13} ry={7} fill={i % 2 ? colors.leafDark : colors.leaf} stroke={OUTLINE} strokeWidth={1.2} transform={`rotate(${r} ${x} ${y})`} />
                <Ellipse cx={x - 3} cy={y - 2} rx={4} ry={1.6} fill={colors.white} opacity={0.4} transform={`rotate(${r} ${x} ${y})`} />
              </G>
            ))}
          </G>,
        )}
        {part(
          'flower',
          <G>
            <Glow show={highlight === 'flower'}>
              <Circle cx={76} cy={84} r={16} fill={colors.grape} />
              <Circle cx={124} cy={78} r={16} fill={colors.grape} />
              <Circle cx={100} cy={48} r={16} fill={colors.grape} />
              <Circle cx={54} cy={98} r={14} fill={colors.grape} />
              <Circle cx={148} cy={92} r={14} fill={colors.grape} />
            </Glow>
            {[[76, 84], [124, 78], [100, 48], [54, 98], [148, 92], [110, 112]].map(([x, y], i) => flower(x, y, i))}
          </G>,
        )}
      </G>
    );
  },
};
