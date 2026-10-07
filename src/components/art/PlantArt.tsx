import { useRef, type ReactNode } from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
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
    return (
      <G key={key} opacity={dimOthers && highlight && !active ? 0.3 : 1}>
        {children}
      </G>
    );
  };

  const Draw = DRAWINGS[plantId] ?? DRAWINGS.sampaguita;

  // One tap target for the whole drawing; the part is found from where the finger landed. This works the same
  // on Android and web, and the generous zones make thin parts (stems, roots) easy for small fingers.
  const box = useRef<View>(null);
  const onPress = (e: GestureResponderEvent) => {
    if (!onPartPress) return;
    // locationX isn't reliable on web, so use the tap's page position minus the drawing's page position.
    const { pageX, pageY } = e.nativeEvent;
    box.current?.measure((_x, _y, _w, _h, left, top) => {
      const scale = 200 / size;
      const x = (pageX - left) * scale;
      const y = (pageY - top) * scale + (full ? 0 : 10);
      const zones = HIT_ZONES[plantId] ?? [];
      const hit = zones.find((z) => x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h);
      if (hit) onPartPress(hit.key);
    });
  };

  const drawing = (
    <Svg width={size} height={height} viewBox={viewBox} pointerEvents="none">
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

  if (!onPartPress) return drawing;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Plant drawing. Tap a part to learn about it." onPress={onPress}>
      <View ref={box} collapsable={false}>
        {drawing}
      </View>
    </Pressable>
  );
}

type Zone = { key: PartKey; x: number; y: number; w: number; h: number };

/** Tap areas in drawing coordinates (200 x 240). Checked in order, so small parts come before the big ones around them. */
const HIT_ZONES: Record<string, Zone[]> = {
  gumamela: [
    { key: 'flower', x: 54, y: 8, w: 92, h: 84 },
    { key: 'stem', x: 86, y: 128, w: 28, h: 48 },
    { key: 'leaf', x: 20, y: 60, w: 160, h: 104 },
    { key: 'stem', x: 84, y: 92, w: 32, h: 36 },
    { key: 'root', x: 50, y: 176, w: 100, h: 64 },
  ],
  makahiya: [
    { key: 'flower', x: 74, y: 56, w: 36, h: 34 },
    { key: 'flower', x: 4, y: 122, w: 36, h: 36 },
    { key: 'flower', x: 162, y: 106, w: 36, h: 36 },
    { key: 'stem', x: 84, y: 156, w: 32, h: 20 },
    { key: 'leaf', x: 10, y: 88, w: 180, h: 66 },
    { key: 'stem', x: 10, y: 140, w: 180, h: 36 },
    { key: 'root', x: 56, y: 176, w: 88, h: 64 },
  ],
  kalamansi: [
    { key: 'fruit', x: 46, y: 74, w: 24, h: 24 },
    { key: 'fruit', x: 84, y: 84, w: 24, h: 24 },
    { key: 'fruit', x: 126, y: 72, w: 24, h: 24 },
    { key: 'fruit', x: 108, y: 40, w: 24, h: 24 },
    { key: 'fruit', x: 64, y: 38, w: 24, h: 24 },
    { key: 'stem', x: 82, y: 108, w: 36, h: 68 },
    { key: 'leaf', x: 18, y: 20, w: 164, h: 100 },
    { key: 'root', x: 50, y: 176, w: 100, h: 64 },
  ],
  malunggay: [
    { key: 'fruit', x: 56, y: 96, w: 24, h: 58 },
    { key: 'fruit', x: 128, y: 96, w: 24, h: 50 },
    { key: 'stem', x: 86, y: 100, w: 28, h: 76 },
    { key: 'leaf', x: 10, y: 8, w: 180, h: 108 },
    { key: 'stem', x: 86, y: 44, w: 28, h: 56 },
    { key: 'root', x: 60, y: 176, w: 80, h: 64 },
  ],
  pako: [
    { key: 'spores', x: 36, y: 100, w: 40, h: 34 },
    { key: 'stem', x: 82, y: 140, w: 36, h: 36 },
    { key: 'leaf', x: 10, y: 26, w: 180, h: 126 },
    { key: 'root', x: 50, y: 176, w: 100, h: 64 },
  ],
  palay: [
    { key: 'fruit', x: 58, y: 54, w: 36, h: 46 },
    { key: 'fruit', x: 100, y: 46, w: 30, h: 46 },
    { key: 'fruit', x: 118, y: 62, w: 26, h: 34 },
    { key: 'stem', x: 84, y: 100, w: 32, h: 76 },
    { key: 'leaf', x: 6, y: 60, w: 188, h: 116 },
    { key: 'root', x: 50, y: 176, w: 100, h: 64 },
  ],
  saba: [
    { key: 'fruit', x: 102, y: 84, w: 40, h: 74 },
    { key: 'stem', x: 86, y: 76, w: 28, h: 100 },
    { key: 'leaf', x: 2, y: 2, w: 196, h: 86 },
    { key: 'root', x: 50, y: 176, w: 100, h: 64 },
  ],
  mongo: [
    { key: 'fruit', x: 62, y: 130, w: 20, h: 42 },
    { key: 'fruit', x: 124, y: 114, w: 20, h: 42 },
    { key: 'fruit', x: 82, y: 94, w: 20, h: 32 },
    { key: 'leaf', x: 46, y: 66, w: 112, h: 98 },
    { key: 'stem', x: 88, y: 84, w: 24, h: 92 },
    { key: 'root', x: 60, y: 176, w: 80, h: 64 },
  ],
  niyog: [
    { key: 'fruit', x: 94, y: 46, w: 38, h: 34 },
    { key: 'leaf', x: 10, y: 2, w: 184, h: 86 },
    { key: 'stem', x: 84, y: 80, w: 36, h: 96 },
    { key: 'root', x: 40, y: 176, w: 120, h: 50 },
  ],
  narra: [
    { key: 'fruit', x: 44, y: 70, w: 28, h: 28 },
    { key: 'fruit', x: 128, y: 66, w: 28, h: 28 },
    { key: 'fruit', x: 82, y: 78, w: 28, h: 28 },
    { key: 'fruit', x: 108, y: 14, w: 28, h: 28 },
    { key: 'root', x: 60, y: 148, w: 80, h: 28 },
    { key: 'stem', x: 84, y: 98, w: 32, h: 50 },
    { key: 'leaf', x: 6, y: 6, w: 188, h: 104 },
    { key: 'root', x: 40, y: 176, w: 120, h: 60 },
  ],
  kawayan: [
    { key: 'shoot', x: 136, y: 134, w: 34, h: 44 },
    { key: 'stem', x: 66, y: 60, w: 20, h: 118 },
    { key: 'stem', x: 88, y: 60, w: 20, h: 118 },
    { key: 'stem', x: 110, y: 60, w: 20, h: 118 },
    { key: 'leaf', x: 8, y: 4, w: 184, h: 108 },
    { key: 'root', x: 20, y: 178, w: 160, h: 46 },
  ],
  bakawan: [
    { key: 'fruit', x: 60, y: 70, w: 16, h: 46 },
    { key: 'fruit', x: 126, y: 68, w: 16, h: 50 },
    { key: 'fruit', x: 78, y: 76, w: 14, h: 36 },
    { key: 'fruit', x: 110, y: 78, w: 14, h: 32 },
    { key: 'stem', x: 88, y: 64, w: 24, h: 50 },
    { key: 'leaf', x: 14, y: 8, w: 172, h: 64 },
    { key: 'root', x: 18, y: 110, w: 164, h: 76 },
  ],
  kangkong: [
    { key: 'flower', x: 52, y: 36, w: 36, h: 34 },
    { key: 'flower', x: 112, y: 32, w: 36, h: 34 },
    { key: 'stem', x: 0, y: 116, w: 200, h: 20 },
    { key: 'leaf', x: 8, y: 62, w: 184, h: 54 },
    { key: 'root', x: 20, y: 136, w: 160, h: 44 },
  ],
  mango: [
    { key: 'fruit', x: 54, y: 80, w: 32, h: 34 },
    { key: 'fruit', x: 118, y: 82, w: 32, h: 34 },
    { key: 'fruit', x: 88, y: 92, w: 32, h: 32 },
    { key: 'stem', x: 80, y: 112, w: 40, h: 64 },
    { key: 'leaf', x: 14, y: 10, w: 172, h: 104 },
    { key: 'root', x: 44, y: 176, w: 112, h: 64 },
  ],
  sampaguita: [
    { key: 'flower', x: 62, y: 70, w: 28, h: 28 },
    { key: 'flower', x: 110, y: 64, w: 28, h: 28 },
    { key: 'flower', x: 86, y: 34, w: 28, h: 28 },
    { key: 'flower', x: 40, y: 84, w: 28, h: 28 },
    { key: 'flower', x: 134, y: 78, w: 28, h: 28 },
    { key: 'flower', x: 96, y: 98, w: 28, h: 28 },
    { key: 'stem', x: 86, y: 146, w: 30, h: 30 },
    { key: 'leaf', x: 30, y: 50, w: 140, h: 100 },
    { key: 'root', x: 60, y: 176, w: 80, h: 64 },
  ],
};

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
  gumamela: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={204} rx={44} ry={28} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 q-2 28 2 54', 'M100 182 q-20 10 -36 28', 'M100 182 q20 8 36 24', 'M86 200 l-12 8', 'M116 196 l12 6'])}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={84} y={90} width={32} height={88} rx={14} fill={colors.sun} />
          </Glow>
          <Path
            d="M100 176 q-3 -40 0 -80 M100 140 q-18 -8 -40 -24 M100 124 q20 -8 42 -28 M100 100 q-4 -20 0 -36"
            stroke="#7A5230"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={100} cy={112} rx={84} ry={46} fill={colors.sun} />
          </Glow>
          {[
            [56, 112, -35], [146, 92, 35], [72, 146, -15], [130, 136, 20], [80, 92, -55], [122, 70, 50], [40, 128, -10], [160, 112, 15],
          ].map(([x, y, r], i) => (
            <G key={i} transform={`rotate(${r} ${x} ${y})`}>
              <Path
                d={`M${x - 16} ${y} q8 -12 16 -11 l3 3 l3 -2 q7 2 10 10 q-3 8 -10 10 l-3 -2 l-3 3 q-8 1 -16 -11z`}
                fill={i % 2 ? colors.leafDark : colors.leaf}
                stroke={OUTLINE}
                strokeWidth={1.2}
              />
              <Path d={`M${x - 15} ${y} h28`} stroke={colors.leafDark} strokeWidth={1.2} opacity={0.6} />
            </G>
          ))}
        </G>,
      )}
      {part(
        'flower',
        <G>
          <Glow show={highlight === 'flower'}>
            <Circle cx={100} cy={52} r={46} fill={colors.sun} />
          </Glow>
          {petals(100, 56, 5, 17, 21, 19, '#E8304A')}
          <Circle cx={100} cy={56} r={9} fill="#8E1426" />
          {/* Long staminal column: pollen dots along it, red pistil tips at the end */}
          <Path d="M100 56 q14 -10 28 -30" stroke="#F7B9C3" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          {[[110, 46], [116, 40], [121, 34], [125, 29]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={2.4} fill={colors.sun} stroke={OUTLINE} strokeWidth={0.6} />
          ))}
          {[[127, 22], [132, 24], [130, 19]].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={2.2} fill="#B71C34" />
          ))}
        </G>,
      )}
    </G>
  ),

  makahiya: ({ part, highlight, full }) => {
    // Feathery leaf: a midrib with many tiny leaflets on both sides.
    const leaf = (x: number, y: number, angle: number, k: number) => (
      <G key={k} transform={`rotate(${angle} ${x} ${y})`}>
        <Path d={`M${x} ${y} h34`} stroke={colors.leafDark} strokeWidth={1.4} />
        {[5, 10, 15, 20, 25, 30].map((dx) => (
          <G key={dx}>
            <Ellipse cx={x + dx} cy={y - 4} rx={2.6} ry={4.2} fill={colors.leaf} stroke={OUTLINE} strokeWidth={0.6} />
            <Ellipse cx={x + dx} cy={y + 4} rx={2.6} ry={4.2} fill={colors.leafLight} stroke={OUTLINE} strokeWidth={0.6} />
          </G>
        ))}
      </G>
    );
    const puff = (x: number, y: number, k: number) => (
      <G key={k}>
        {Array.from({ length: 16 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 16;
          return (
            <Line key={i} x1={x} y1={y} x2={x + 11 * Math.cos(a)} y2={y + 11 * Math.sin(a)} stroke="#F48FB1" strokeWidth={2} strokeLinecap="round" />
          );
        })}
        <Circle cx={x} cy={y} r={5} fill={colors.pink} />
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
              {roots(ROOT, ['M100 176 q2 22 -2 44', 'M100 180 q-16 8 -28 22', 'M100 180 q16 8 28 20', 'M92 194 l-8 8', 'M108 192 l8 6'], 2.5)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Ellipse cx={100} cy={150} rx={86} ry={30} fill={colors.sun} />
            </Glow>
            <Path d="M100 174 q-40 -30 -84 -22 M100 174 q40 -40 86 -34 M100 174 q-4 -50 -8 -92" stroke="#B5523B" strokeWidth={3.5} strokeLinecap="round" fill="none" />
            {[[60, 158], [40, 154], [140, 146], [164, 141], [97, 130], [94, 106]].map(([x, y], i) => (
              <Path key={i} d={`M${x} ${y} l2 -4 l2 4z`} fill="#8C3A28" />
            ))}
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={124} rx={92} ry={52} fill={colors.sun} />
            </Glow>
            {leaf(52, 156, -150, 0)}
            {leaf(30, 150, -120, 1)}
            {leaf(150, 140, -40, 2)}
            {leaf(172, 136, -70, 3)}
            {leaf(96, 120, -130, 4)}
            {leaf(96, 110, -50, 5)}
            {leaf(93, 92, -110, 6)}
          </G>,
        )}
        {part(
          'flower',
          <G>
            <Glow show={highlight === 'flower'}>
              <Circle cx={92} cy={74} r={18} fill={colors.sun} />
              <Circle cx={22} cy={140} r={18} fill={colors.sun} />
              <Circle cx={180} cy={124} r={18} fill={colors.sun} />
            </Glow>
            {puff(92, 74, 0)}
            {puff(22, 140, 1)}
            {puff(180, 124, 2)}
          </G>,
        )}
      </G>
    );
  },

  kalamansi: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={204} rx={46} ry={28} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 q2 26 -2 52', 'M100 182 q-22 8 -38 26', 'M100 182 q22 8 38 22', 'M86 198 l-12 8', 'M114 196 l12 6'], 3)}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={84} y={100} width={32} height={78} rx={12} fill={colors.sun} />
          </Glow>
          <Path d="M93 176 q4 -36 1 -72 h12 q-3 36 1 72z" fill="#8A5A34" stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M98 108 q-14 -10 -28 -14 M102 108 q14 -10 30 -14" stroke="#8A5A34" strokeWidth={5} strokeLinecap="round" fill="none" />
          <Path d="M94 140 l-5 -2 l5 -3z M106 128 l5 -2 l-5 -3z" fill="#5E3B20" />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={100} cy={70} rx={88} ry={54} fill={colors.sun} />
          </Glow>
          <Ellipse cx={100} cy={72} rx={76} ry={44} fill="#2F7A2A" stroke={OUTLINE} strokeWidth={1.5} />
          {[
            [44, 70, -30], [62, 46, -15], [88, 32, 5], [116, 32, -5], [142, 46, 15], [158, 70, 30], [70, 90, -20], [130, 92, 20],
            [100, 58, 0], [80, 68, 25], [122, 66, -25],
          ].map(([x, y, r], i) => (
            <G key={i}>
              <Ellipse cx={x} cy={y} rx={13} ry={7} fill={i % 3 ? colors.leaf : colors.leafDark} stroke={OUTLINE} strokeWidth={1} transform={`rotate(${r} ${x} ${y})`} />
              <Ellipse cx={x - 3} cy={y - 2} rx={4} ry={1.6} fill={colors.white} opacity={0.45} transform={`rotate(${r} ${x} ${y})`} />
            </G>
          ))}
        </G>,
      )}
      {part(
        'fruit',
        <G>
          <Glow show={highlight === 'fruit'}>
            {[[58, 86], [96, 96], [138, 84], [120, 52], [76, 50]].map(([x, y], i) => (
              <Circle key={i} cx={x} cy={y} r={13} fill={colors.sun} />
            ))}
          </Glow>
          {[[58, 86], [96, 96], [138, 84], [120, 52], [76, 50]].map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x} cy={y} r={7.5} fill={i === 2 ? '#FFA62B' : '#7DC242'} stroke={OUTLINE} strokeWidth={1.3} />
              <Circle cx={x - 2.5} cy={y - 2.5} r={2} fill={colors.white} opacity={0.6} />
            </G>
          ))}
        </G>,
      )}
    </G>
  ),

  malunggay: ({ part, highlight, full }) => {
    // One compound leaf: a drooping midrib lined with tiny round leaflets.
    const frond = (d: string, dots: [number, number][], k: number) => (
      <G key={k}>
        <Path d={d} stroke={colors.leafDark} strokeWidth={1.4} fill="none" />
        {dots.map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={3.6} fill={i % 2 ? colors.leafLight : colors.leaf} stroke={OUTLINE} strokeWidth={0.5} />
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
                <Ellipse cx={100} cy={206} rx={36} ry={30} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 v56', 'M100 184 q-16 8 -26 22', 'M100 184 q16 8 26 20', 'M100 204 l-10 8'], 3.5)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={86} y={44} width={28} height={134} rx={12} fill={colors.sun} />
            </Glow>
            <Path d="M96 176 q2 -60 2 -126 h5 q0 66 2 126z" fill="#B49A7A" stroke={OUTLINE} strokeWidth={1.3} />
            <Path d="M99 96 q-24 -14 -46 -12 M101 80 q24 -16 50 -14 M100 60 q-16 -12 -34 -12" stroke="#B49A7A" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={78} rx={92} ry={50} fill={colors.sun} />
            </Glow>
            {frond('M53 84 q-24 4 -36 30', [[46, 86], [38, 90], [31, 96], [25, 103], [20, 110], [44, 80], [34, 84], [27, 90]], 0)}
            {frond('M151 66 q26 2 36 28', [[158, 68], [166, 72], [173, 78], [179, 85], [184, 92], [160, 62], [170, 66], [178, 72]], 1)}
            {frond('M66 48 q-20 -2 -32 16', [[60, 48], [52, 49], [45, 52], [39, 57], [58, 42], [50, 43], [42, 47]], 2)}
            {frond('M100 52 q16 -20 40 -22', [[108, 44], [115, 38], [123, 34], [131, 31], [104, 38], [112, 32], [120, 28]], 3)}
            {frond('M100 52 q-8 -24 -4 -40', [[98, 42], [96, 34], [95, 26], [95, 18], [104, 40], [102, 32], [101, 24]], 4)}
          </G>,
        )}
        {part(
          'fruit',
          <G>
            <Glow show={highlight === 'fruit'}>
              <Rect x={58} y={84} width={20} height={70} rx={10} fill={colors.sun} />
              <Rect x={130} y={68} width={20} height={78} rx={10} fill={colors.sun} />
            </Glow>
            <Path d="M68 86 q-4 34 2 64 M140 70 q6 38 -2 72" stroke="#7FA640" strokeWidth={5} strokeLinecap="round" fill="none" />
            <Path d="M68 86 q-4 34 2 64 M140 70 q6 38 -2 72" stroke={OUTLINE} strokeWidth={1} strokeDasharray="2 9" fill="none" />
          </G>,
        )}
      </G>
    );
  },

  // Pako (native fern), for World 3.
  pako: ({ part, highlight, full }) => {
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

  palay: ({ part, highlight, full }) => {
    const panicles: [number, number][][] = [
      [[84, 62], [80, 67], [76, 73], [73, 79], [70, 85], [68, 92]],
      [[106, 54], [111, 58], [115, 63], [118, 69], [120, 76], [121, 83]],
      [[122, 68], [126, 72], [130, 77], [133, 83], [136, 89]],
    ];
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Ellipse cx={100} cy={200} rx={46} ry={26} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 q-4 24 -2 46', 'M100 176 q-20 14 -34 30', 'M100 176 q20 14 34 28', 'M96 178 q-10 18 -20 36', 'M104 178 q10 18 20 36', 'M100 176 q-30 6 -44 14', 'M100 176 q30 6 44 12'], 2)}
            </G>,
          )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={128} rx={90} ry={52} fill={colors.sun} />
            </Glow>
            {['M100 174 q-24 -40 -78 -62', 'M100 174 q-10 -50 -48 -98', 'M100 174 q22 -44 76 -64', 'M100 174 q12 -54 50 -94', 'M100 174 q-40 -20 -88 -12', 'M100 174 q40 -20 90 -14'].map((d, i) => (
              <Path key={i} d={d} stroke={i % 2 ? colors.leafDark : colors.leaf} strokeWidth={6} strokeLinecap="round" fill="none" />
            ))}
          </G>,
        )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={80} y={52} width={44} height={124} rx={14} fill={colors.sun} />
            </Glow>
            <Path d="M100 176 q-6 -60 -16 -114 M100 176 q2 -64 6 -122 M100 176 q8 -56 22 -108" stroke="#9CCB5A" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          </G>,
        )}
        {part(
          'fruit',
          <G>
            <Glow show={highlight === 'fruit'}>
              <Ellipse cx={76} cy={78} rx={16} ry={22} fill={colors.sun} />
              <Ellipse cx={115} cy={68} rx={14} ry={22} fill={colors.sun} />
              <Ellipse cx={130} cy={78} rx={13} ry={18} fill={colors.sun} />
            </Glow>
            {panicles.map((pts, k) => (
              <G key={k}>
                <Path d={`M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`} stroke="#C9A23A" strokeWidth={1.5} fill="none" />
                {pts.map(([x, y], i) => (
                  <Ellipse key={i} cx={x + (i % 2 ? 3 : -3)} cy={y} rx={2.8} ry={4.6} fill="#E8C35A" stroke={OUTLINE} strokeWidth={0.7} />
                ))}
              </G>
            ))}
          </G>,
        )}
      </G>
    );
  },

  saba: ({ part, highlight, full }) => (
    <G>
      {full &&
        part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={200} rx={48} ry={26} fill={colors.sun} />
            </Glow>
            {roots(ROOT, ['M100 176 q-2 22 0 40', 'M96 178 q-20 10 -40 22', 'M104 178 q20 10 40 22', 'M98 180 q-10 18 -22 34', 'M102 180 q10 18 22 34'], 3)}
          </G>,
        )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={82} y={70} width={36} height={108} rx={14} fill={colors.sun} />
          </Glow>
          <Path d="M90 176 q2 -50 4 -100 h12 q2 50 4 100z" fill="#8DB255" stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M96 172 q1 -40 2 -90 M104 172 q-1 -40 0 -90" stroke="#6E8B3D" strokeWidth={1.4} fill="none" />
          <Ellipse cx={95} cy={140} rx={3} ry={6} fill="#7A5A3A" opacity={0.45} />
          <Ellipse cx={105} cy={112} rx={3} ry={5} fill="#7A5A3A" opacity={0.45} />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={100} cy={46} rx={96} ry={44} fill={colors.sun} />
          </Glow>
          {[
            [56, 72, -18], [146, 68, 20], [74, 44, -48], [128, 42, 46],
          ].map(([x, y, r], i) => (
            <G key={i} transform={`rotate(${r} ${x} ${y})`}>
              <Ellipse cx={x} cy={y} rx={46} ry={14} fill={i % 2 ? colors.leaf : colors.leafLight} stroke={OUTLINE} strokeWidth={1.3} />
              <Path d={`M${x - 44} ${y} h88`} stroke={colors.leafDark} strokeWidth={1.6} />
              <Path d={`M${x - 20} ${y} l-4 12 M${x + 14} ${y} l4 -12`} stroke={colors.cream} strokeWidth={1.4} />
            </G>
          ))}
        </G>,
      )}
      {part(
        'fruit',
        <G>
          <Glow show={highlight === 'fruit'}>
            <Ellipse cx={122} cy={118} rx={22} ry={40} fill={colors.sun} />
          </Glow>
          <Path d="M104 80 q14 6 16 22 v40" stroke="#6E8B3D" strokeWidth={3} fill="none" />
          {[96, 106, 116, 126].map((y, row) =>
            [-9, -3, 3, 9].map((dx, i) => (
              <Path
                key={`${row}-${i}`}
                d={`M${120 + dx} ${y} q${dx > 0 ? 6 : -6} -4 ${dx > 0 ? 7 : -7} -12`}
                stroke="#B7C94A"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              />
            )),
          )}
          <Path d="M120 134 q-8 6 -6 16 q6 8 12 0 q2 -10 -6 -16z" fill="#7B3F6E" stroke={OUTLINE} strokeWidth={1.2} />
        </G>,
      )}
    </G>
  ),

  mongo: ({ part, highlight, full }) => {
    const trio = (x: number, y: number, k: number) => (
      <G key={k}>
        <Ellipse cx={x - 11} cy={y + 2} rx={12} ry={7} fill={colors.leaf} stroke={OUTLINE} strokeWidth={1} transform={`rotate(-25 ${x - 9} ${y + 2})`} />
        <Ellipse cx={x + 11} cy={y + 2} rx={12} ry={7} fill={colors.leaf} stroke={OUTLINE} strokeWidth={1} transform={`rotate(25 ${x + 9} ${y + 2})`} />
        <Ellipse cx={x} cy={y - 10} rx={7} ry={12} fill={colors.leafLight} stroke={OUTLINE} strokeWidth={1} />
      </G>
    );
    const pods: string[] = ['M74 132 q-8 22 -2 40', 'M130 116 q10 20 4 40', 'M94 96 q-10 14 -10 30'];
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Ellipse cx={100} cy={200} rx={36} ry={26} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 v48', 'M100 186 q-14 6 -22 18', 'M100 186 q14 6 22 16', 'M100 204 l-8 8', 'M100 200 l8 8'], 2.5)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={88} y={84} width={24} height={92} rx={10} fill={colors.sun} />
            </Glow>
            <Path d="M100 176 q-2 -40 2 -86 M100 142 q-16 -10 -28 -12 M101 122 q16 -8 30 -6" stroke="#6BAA3A" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={102} cy={108} rx={58} ry={40} fill={colors.sun} />
            </Glow>
            {trio(70, 126, 0)}
            {trio(134, 112, 1)}
            {trio(102, 84, 2)}
            {trio(84, 150, 3)}
            {trio(120, 146, 4)}
          </G>,
        )}
        {part(
          'fruit',
          <G>
            <Glow show={highlight === 'fruit'}>
              <Rect x={62} y={130} width={20} height={42} rx={10} fill={colors.sun} />
              <Rect x={124} y={114} width={20} height={42} rx={10} fill={colors.sun} />
              <Rect x={82} y={94} width={20} height={32} rx={10} fill={colors.sun} />
            </Glow>
            {pods.map((d, i) => (
              <G key={i}>
                <Path d={d} stroke="#3E5A2A" strokeWidth={7} strokeLinecap="round" fill="none" />
                <Path d={d} stroke="#6E8B4A" strokeWidth={1.5} strokeDasharray="3 4" fill="none" />
              </G>
            ))}
          </G>,
        )}
      </G>
    );
  },

  niyog: ({ part, highlight, full }) => {
    // Frond: a curved midrib with leaflets sticking out both sides.
    const frond = (x2: number, y2: number, cx: number, cy: number, k: number) => {
      const x0 = 112;
      const y0 = 50;
      const lines = [];
      for (let t = 0.15; t <= 0.95; t += 0.1) {
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x2;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y2;
        const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x2 - cx);
        const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y2 - cy);
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * 11 * (1 - t * 0.4);
        const ny = (dx / len) * 11 * (1 - t * 0.4);
        lines.push(`M${x} ${y} l${nx} ${ny + 3} M${x} ${y} l${-nx} ${-ny + 3}`);
      }
      return (
        <G key={k}>
          <Path d={lines.join(' ')} stroke={k % 2 ? colors.leaf : colors.leafDark} strokeWidth={2.4} strokeLinecap="round" />
          <Path d={`M${x0} ${y0} Q${cx} ${cy} ${x2} ${y2}`} stroke="#6E8B3D" strokeWidth={2.4} fill="none" />
        </G>
      );
    };
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Ellipse cx={100} cy={196} rx={56} ry={24} fill={colors.sun} />
              </Glow>
              {roots(ROOT, ['M100 176 q-2 16 0 30', 'M100 178 q-24 6 -48 12', 'M100 178 q24 6 48 12', 'M98 180 q-14 14 -30 22', 'M102 180 q14 14 30 22', 'M100 180 q-6 18 -10 30', 'M100 180 q6 18 10 30'], 2)}
            </G>,
          )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={86} y={52} width={34} height={126} rx={14} fill={colors.sun} />
            </Glow>
            <Path d="M92 176 q-4 -60 14 -124 h10 q-16 64 -12 124z" fill="#A47A4F" stroke={OUTLINE} strokeWidth={1.5} />
            {[160, 144, 128, 112, 96, 80, 66].map((y, i) => (
              <Path key={i} d={`M${94 + (176 - y) * 0.08} ${y} h10`} stroke="#7A5530" strokeWidth={1.4} />
            ))}
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={108} cy={44} rx={94} ry={40} fill={colors.sun} />
            </Glow>
            {frond(30, 82, 60, 30, 0)}
            {frond(24, 42, 70, 18, 1)}
            {frond(70, 10, 90, 18, 2)}
            {frond(156, 8, 130, 14, 3)}
            {frond(190, 44, 160, 20, 4)}
            {frond(182, 86, 160, 40, 5)}
          </G>,
        )}
        {part(
          'fruit',
          <G>
            <Glow show={highlight === 'fruit'}>
              <Circle cx={112} cy={62} r={20} fill={colors.sun} />
            </Glow>
            {[[104, 58], [119, 58], [111, 69], [124, 68]].map(([x, y], i) => (
              <G key={i}>
                <Circle cx={x} cy={y} r={7.5} fill={i === 3 ? '#9A6A3A' : '#6E9B3A'} stroke={OUTLINE} strokeWidth={1.3} />
                <Circle cx={x - 2.5} cy={y - 2.5} r={2} fill={colors.white} opacity={0.4} />
              </G>
            ))}
          </G>,
        )}
      </G>
    );
  },

  narra: ({ part, highlight, full }) => (
    <G>
      {part(
        'root',
        <G>
          <Glow show={highlight === 'root'}>
            <Ellipse cx={100} cy={full ? 188 : 172} rx={48} ry={full ? 40 : 14} fill={colors.sun} />
          </Glow>
          {/* Buttress roots flare out like walls at the bottom of the trunk */}
          <Path d="M92 150 q-6 18 -26 26 h26z M108 150 q6 18 26 26 h-26z" fill="#7A3F22" stroke={OUTLINE} strokeWidth={1.2} />
          {full ? roots(ROOT, ['M100 176 v50', 'M86 178 q-20 8 -40 22', 'M114 178 q20 8 40 20', 'M96 182 q-8 16 -18 28', 'M104 182 q8 16 18 28'], 3.5) : null}
        </G>,
      )}
      {part(
        'stem',
        <G>
          <Glow show={highlight === 'stem'}>
            <Rect x={84} y={84} width={32} height={70} rx={12} fill={colors.sun} />
          </Glow>
          <Path d="M92 176 q2 -50 2 -92 h12 q0 42 2 92z" fill="#8A4B2A" stroke={OUTLINE} strokeWidth={1.5} />
          <Path d="M96 90 q-18 -10 -36 -14 M104 90 q18 -12 38 -14" stroke="#8A4B2A" strokeWidth={6} strokeLinecap="round" fill="none" />
          <Path d="M98 110 q2 20 0 40 M104 100 q-1 14 1 26" stroke="#6A3218" strokeWidth={1.4} fill="none" />
        </G>,
      )}
      {part(
        'leaf',
        <G>
          <Glow show={highlight === 'leaf'}>
            <Ellipse cx={100} cy={58} rx={96} ry={52} fill={colors.sun} />
          </Glow>
          <Ellipse cx={100} cy={60} rx={88} ry={44} fill={colors.leafDark} stroke={OUTLINE} strokeWidth={1.5} />
          <Circle cx={46} cy={62} r={30} fill={colors.leaf} />
          <Circle cx={88} cy={38} r={34} fill={colors.leaf} />
          <Circle cx={138} cy={40} r={32} fill={colors.leafLight} />
          <Circle cx={156} cy={70} r={26} fill={colors.leaf} />
          <Circle cx={100} cy={76} r={26} fill={colors.leafLight} />
          {[[40, 50, -20], [80, 24, 10], [134, 26, -10], [160, 60, 30], [70, 76, 15], [118, 64, -25]].map(([x, y, r], i) => (
            <Ellipse key={i} cx={x} cy={y} rx={9} ry={4} fill={colors.white} opacity={0.3} transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </G>,
      )}
      {part(
        'fruit',
        <G>
          <Glow show={highlight === 'fruit'}>
            {[[58, 84], [142, 80], [96, 92], [122, 28]].map(([x, y], i) => (
              <Circle key={i} cx={x} cy={y} r={14} fill={colors.sun} />
            ))}
          </Glow>
          {[[58, 84], [142, 80], [96, 92], [122, 28]].map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x} cy={y} r={8} fill="#E3CF86" stroke={OUTLINE} strokeWidth={1.2} />
              <Circle cx={x} cy={y} r={3.2} fill="#A9843E" />
            </G>
          ))}
        </G>,
      )}
    </G>
  ),

  kawayan: ({ part, highlight, full }) => {
    const culms = [76, 98, 120];
    return (
      <G>
        {full &&
          part(
            'root',
            <G>
              <Glow show={highlight === 'root'}>
                <Rect x={22} y={182} width={156} height={34} rx={14} fill={colors.sun} />
              </Glow>
              <Path d="M30 192 h140" stroke="#C9A060" strokeWidth={7} strokeLinecap="round" />
              {[40, 60, 82, 104, 126, 148, 164].map((x, i) => (
                <Path key={i} d={`M${x} 194 q${i % 2 ? 4 : -4} 10 ${i % 2 ? 2 : -2} 20`} stroke={ROOT} strokeWidth={2} fill="none" />
              ))}
              <Path d="M82 178 v12 M104 178 v12 M126 178 v12" stroke="#C9A060" strokeWidth={4} />
            </G>,
          )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={52} rx={92} ry={46} fill={colors.sun} />
            </Glow>
            {[
              [60, 40, -30], [52, 70, -15], [140, 34, 30], [150, 64, 15], [88, 22, -50], [116, 18, 45], [66, 98, -20], [134, 92, 20], [100, 50, 0],
            ].map(([x, y, r], i) => (
              <G key={i} transform={`rotate(${r} ${x} ${y})`}>
                <Ellipse cx={x - 10} cy={y} rx={13} ry={3.4} fill={colors.leaf} stroke={OUTLINE} strokeWidth={0.8} transform={`rotate(-20 ${x} ${y})`} />
                <Ellipse cx={x + 10} cy={y} rx={13} ry={3.4} fill={colors.leafLight} stroke={OUTLINE} strokeWidth={0.8} transform={`rotate(20 ${x} ${y})`} />
              </G>
            ))}
          </G>,
        )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              {culms.map((x) => (
                <Rect key={x} x={x - 10} y={12} width={20} height={166} rx={8} fill={colors.sun} />
              ))}
            </Glow>
            {culms.map((x, i) => (
              <G key={x}>
                <Rect x={x - 6} y={18 + i * 6} width={12} height={158 - i * 6} rx={4} fill={i === 1 ? '#7CB342' : '#8BC34A'} stroke={OUTLINE} strokeWidth={1.2} />
                {[40, 66, 92, 118, 144].map((y) => (
                  <Path key={y} d={`M${x - 6} ${y + i * 4} h12`} stroke="#4E7A22" strokeWidth={2} />
                ))}
              </G>
            ))}
          </G>,
        )}
        {part(
          'shoot',
          <G>
            <Glow show={highlight === 'shoot'}>
              <Ellipse cx={153} cy={160} rx={16} ry={22} fill={colors.sun} />
            </Glow>
            <Path d="M143 176 q4 -22 10 -36 q6 14 10 36z" fill="#B8A05A" stroke={OUTLINE} strokeWidth={1.3} />
            <Path d="M146 166 q7 -4 14 0 M148 156 q5 -3 10 0" stroke="#8A7038" strokeWidth={1.4} fill="none" />
          </G>,
        )}
      </G>
    );
  },

  bakawan: ({ part, highlight, full }) => {
    const seedlings: [number, number, number][] = [[68, 74, 112], [134, 72, 114], [86, 80, 108], [118, 82, 106]];
    return (
      <G>
        {/* Salty coastal water over the mud */}
        <Rect x={0} y={142} width={200} height={full ? 40 : 34} fill="#A8DDF5" />
        <Path d="M10 150 q10 -4 20 0 t20 0 M120 160 q10 -4 20 0 t20 0 M60 170 q10 -4 20 0 t20 0" stroke={colors.white} strokeWidth={1.6} fill="none" />
        {part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Ellipse cx={100} cy={148} rx={82} ry={36} fill={colors.sun} />
            </Glow>
            {['M100 118 q-32 10 -48 58', 'M100 124 q-14 20 -22 52', 'M100 124 q14 20 22 52', 'M100 118 q32 10 48 58', 'M100 110 q-52 10 -72 66', 'M100 110 q52 10 72 66'].map((d, i) => (
              <Path key={i} d={d} stroke="#8A5A34" strokeWidth={4} strokeLinecap="round" fill="none" />
            ))}
          </G>,
        )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={88} y={64} width={24} height={60} rx={10} fill={colors.sun} />
            </Glow>
            <Path d="M95 124 q-2 -30 0 -58 h10 q2 28 0 58z" fill="#7A5230" stroke={OUTLINE} strokeWidth={1.4} />
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={46} rx={92} ry={42} fill={colors.sun} />
            </Glow>
            <Ellipse cx={100} cy={48} rx={82} ry={36} fill="#2F6B2A" stroke={OUTLINE} strokeWidth={1.5} />
            {[
              [40, 50, -30], [62, 28, -15], [92, 18, 5], [124, 20, -5], [150, 32, 15], [164, 54, 30], [76, 58, 20], [120, 56, -20], [100, 40, 0],
            ].map(([x, y, r], i) => (
              <G key={i}>
                <Ellipse cx={x} cy={y} rx={14} ry={7.5} fill={i % 2 ? colors.leaf : '#3F8A35'} stroke={OUTLINE} strokeWidth={1} transform={`rotate(${r} ${x} ${y})`} />
                <Ellipse cx={x - 3} cy={y - 2} rx={4.5} ry={1.6} fill={colors.white} opacity={0.45} transform={`rotate(${r} ${x} ${y})`} />
              </G>
            ))}
          </G>,
        )}
        {part(
          'fruit',
          <G>
            <Glow show={highlight === 'fruit'}>
              {seedlings.map(([x, y1, y2]) => (
                <Rect key={x} x={x - 8} y={y1 - 4} width={16} height={y2 - y1 + 8} rx={8} fill={colors.sun} />
              ))}
            </Glow>
            {seedlings.map(([x, y1, y2]) => (
              <G key={x}>
                <Path d={`M${x} ${y1} V${y2}`} stroke="#5B8C2A" strokeWidth={4.5} strokeLinecap="round" />
                <Path d={`M${x} ${y2 - 6} V${y2}`} stroke="#7A5230" strokeWidth={4.5} strokeLinecap="round" />
              </G>
            ))}
          </G>,
        )}
      </G>
    );
  },

  kangkong: ({ part, highlight, full }) => {
    const nodes = [40, 100, 160];
    const arrowLeaf = (x: number, y: number, r: number, k: number) => (
      <G key={k} transform={`rotate(${r} ${x} ${y})`}>
        <Path d={`M${x} ${y - 30} q-15 14 -13 28 l13 -7 l13 7 q2 -14 -13 -28z`} fill={k % 2 ? colors.leaf : colors.leafLight} stroke={OUTLINE} strokeWidth={1.2} />
        <Path d={`M${x} ${y - 28} v24`} stroke={colors.leafDark} strokeWidth={1.2} />
      </G>
    );
    const trumpet = (x: number, y: number, k: number) => (
      <G key={k}>
        <Path d={`M${x} ${y + 12} l-11 -18 q11 -7 22 0z`} fill="#F3E5F5" stroke={OUTLINE} strokeWidth={1.2} />
        <Circle cx={x} cy={y - 3} r={3} fill="#9C6BC0" />
      </G>
    );
    return (
      <G>
        {/* Pond water */}
        <Rect x={0} y={122} width={200} height={full ? 60 : 60} fill="#A8DDF5" />
        <Path d="M14 148 q10 -4 20 0 t20 0 M110 160 q10 -4 20 0 t20 0" stroke={colors.white} strokeWidth={1.6} fill="none" />
        {part(
          'root',
          <G>
            <Glow show={highlight === 'root'}>
              <Rect x={20} y={130} width={160} height={46} rx={16} fill={colors.sun} />
            </Glow>
            {nodes.map((x) => (
              <Path key={x} d={`M${x} 130 q-4 14 -2 28 M${x} 130 q4 12 6 24 M${x} 130 v32`} stroke="#C9B79A" strokeWidth={1.6} fill="none" />
            ))}
          </G>,
        )}
        {part(
          'stem',
          <G>
            <Glow show={highlight === 'stem'}>
              <Rect x={0} y={116} width={200} height={20} rx={10} fill={colors.sun} />
            </Glow>
            <Path d="M4 128 q48 -8 96 0 t96 -2" stroke="#8BC34A" strokeWidth={8} strokeLinecap="round" fill="none" />
            <Path d="M4 128 q48 -8 96 0 t96 -2" stroke="#DDF0C0" strokeWidth={2.5} strokeLinecap="round" fill="none" />
            {nodes.map((x, i) => (
              <Path key={x} d={`M${x} 126 q${i === 1 ? 2 : -4} -14 ${i === 1 ? 0 : -8} -26`} stroke="#8BC34A" strokeWidth={3} fill="none" />
            ))}
          </G>,
        )}
        {part(
          'leaf',
          <G>
            <Glow show={highlight === 'leaf'}>
              <Ellipse cx={100} cy={88} rx={92} ry={32} fill={colors.sun} />
            </Glow>
            {arrowLeaf(32, 102, -15, 0)}
            {arrowLeaf(100, 100, 0, 1)}
            {arrowLeaf(152, 100, 15, 2)}
            {arrowLeaf(60, 112, -35, 3)}
            {arrowLeaf(128, 112, 30, 4)}
            {arrowLeaf(184, 114, 30, 5)}
          </G>,
        )}
        {part(
          'flower',
          <G>
            <Glow show={highlight === 'flower'}>
              <Circle cx={70} cy={56} r={18} fill={colors.sun} />
              <Circle cx={130} cy={52} r={18} fill={colors.sun} />
            </Glow>
            <Path d="M70 68 q2 22 -6 40 M130 64 q-2 24 4 42" stroke="#8BC34A" strokeWidth={2.5} fill="none" />
            {trumpet(70, 56, 0)}
            {trumpet(130, 52, 1)}
          </G>,
        )}
      </G>
    );
  },

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
