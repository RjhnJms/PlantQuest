import { colors } from '@/lib/palette';

export type PartKey = 'root' | 'stem' | 'leaf' | 'flower' | 'fruit' | 'spores';

export type PlantPart = {
  key: PartKey;
  name: string;
  /** One short sentence, read aloud when the part is tapped. */
  text: string;
};

export type PlantTheme = {
  main: string;
  dark: string;
  pale: string;
};

export type WorldId = 'bakuran' | 'bukid' | 'kalikasan';

export type World = {
  id: WorldId;
  /** Filipino name shown big, with the English meaning under it. */
  name: string;
  meaning: string;
  theme: PlantTheme;
};

export const WORLDS: World[] = [
  { id: 'bakuran', name: 'Bakuran', meaning: 'Backyard', theme: { main: colors.pink, dark: colors.pinkDark, pale: colors.pinkPale } },
  { id: 'bukid', name: 'Bukid', meaning: 'Farm', theme: { main: colors.sun, dark: colors.sunDark, pale: colors.sunPale } },
  { id: 'kalikasan', name: 'Kalikasan', meaning: 'Nature', theme: { main: colors.teal, dark: colors.tealDark, pale: colors.tealPale } },
];

export type Plant = {
  id: string;
  world: WorldId;
  name: string;
  scientificName: string;
  theme: PlantTheme;
  /** Shown on list cards. */
  short: string;
  /** First thing read on the details screen. */
  intro: string;
  funFact: string;
  parts: PlantPart[];
};

// Plants commonly found in the Philippines. Order here is the order of stops on the Home adventure path,
// world by world. DRAFT: facts must be checked by a science teacher before release.
export const PLANTS: Plant[] = [
  // World 1: Bakuran (backyard)
  {
    id: 'sampaguita',
    world: 'bakuran',
    name: 'Sampaguita',
    scientificName: 'Jasminum sambac',
    theme: { main: colors.grape, dark: colors.grapeDark, pale: colors.grapePale },
    short: 'Our national flower. It smells sweet.',
    intro: 'Sampaguita is the national flower of the Philippines. Its small white flowers smell very sweet.',
    funFact: 'Sampaguita flowers open in the evening. That is when their smell is strongest.',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the plant in the soil and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The thin stem can climb and spread like a vine.' },
      { key: 'leaf', name: 'Leaf', text: 'Shiny green leaves make food from sunlight.' },
      { key: 'flower', name: 'Flower', text: 'The white flowers are strung into sweet-smelling garlands.' },
    ],
  },
  {
    id: 'gumamela',
    world: 'bakuran',
    name: 'Gumamela',
    scientificName: 'Hibiscus rosa-sinensis',
    theme: { main: '#E8304A', dark: '#B71C34', pale: '#FFE4E8' },
    short: 'A shrub with big, bright flowers.',
    intro: 'Gumamela is a shrub with big, bright flowers. You can find it in many Filipino gardens.',
    funFact: 'Kids crush gumamela leaves and flowers in water to make soap bubbles!',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the shrub in the soil and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The woody stem is strong and holds up the branches.' },
      { key: 'leaf', name: 'Leaf', text: 'Shiny leaves with jagged edges make food from sunlight.' },
      { key: 'flower', name: 'Flower', text: 'The big flower has a long tube in the middle. It holds the pollen.' },
    ],
  },
  {
    id: 'makahiya',
    world: 'bakuran',
    name: 'Makahiya',
    scientificName: 'Mimosa pudica',
    theme: { main: colors.pink, dark: colors.pinkDark, pale: colors.pinkPale },
    short: 'Its leaves fold up when you touch them.',
    intro: 'Makahiya means shy. Its leaves fold up when you touch them!',
    funFact: 'The leaves open again after a few minutes. Folding may help keep hungry animals away.',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the plant in the ground and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The thin stem creeps on the ground and has tiny thorns.' },
      { key: 'leaf', name: 'Leaf', text: 'Many tiny leaflets fold up quickly when touched.' },
      { key: 'flower', name: 'Flower', text: 'The flower looks like a fluffy pink ball.' },
    ],
  },
  {
    id: 'kalamansi',
    world: 'bakuran',
    name: 'Kalamansi',
    scientificName: 'Citrus × microcarpa',
    theme: { main: colors.sun, dark: colors.sunDark, pale: colors.sunPale },
    short: 'A small tree with sour little fruits.',
    intro: 'Kalamansi is a small tree with tiny, sour fruits. Filipinos use them for juice and food.',
    funFact: 'Kalamansi fruits are green at first. They turn orange when they are very ripe.',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the tree in the soil and drink water.' },
      { key: 'stem', name: 'Trunk', text: 'The woody trunk holds up the branches. Some branches have small thorns.' },
      { key: 'leaf', name: 'Leaf', text: 'The shiny leaves smell like citrus when you crush them.' },
      { key: 'fruit', name: 'Fruit', text: 'The small round fruit is sour and full of juice.' },
    ],
  },
  {
    id: 'malunggay',
    world: 'bakuran',
    name: 'Malunggay',
    scientificName: 'Moringa oleifera',
    theme: { main: colors.leaf, dark: colors.leafDark, pale: colors.leafPale },
    short: 'A tree with tiny leaves we cook in soup.',
    intro: 'Malunggay is a tree with many tiny round leaves. Families cook the leaves in soup.',
    funFact: 'Malunggay leaves are full of vitamins. Some people call it the miracle tree.',
    parts: [
      { key: 'root', name: 'Root', text: 'A long root grows deep into the soil to drink water.' },
      { key: 'stem', name: 'Trunk', text: 'The trunk is thin and soft. Its branches bend easily.' },
      { key: 'leaf', name: 'Leaf', text: 'One big leaf is made of many tiny round leaflets.' },
      { key: 'fruit', name: 'Pod', text: 'The long green pods are fruits. They hold the seeds.' },
    ],
  },

  // World 2: Bukid (farm). Coming next: Palay, Saba, Mongo, Niyog.
  {
    id: 'mango',
    world: 'bukid',
    name: 'Mango',
    scientificName: 'Mangifera indica',
    theme: { main: colors.coral, dark: colors.coralDark, pale: colors.coralPale },
    short: 'A big tree with sweet fruit.',
    intro: 'The mango is a big tree with sweet fruit. The carabao mango from the Philippines is famous around the world.',
    funFact: 'A mango tree can live for more than 100 years and keep making fruit.',
    parts: [
      { key: 'root', name: 'Root', text: 'A long main root grows deep to hold up the big tree.' },
      { key: 'stem', name: 'Trunk', text: 'The trunk is a hard, woody stem. It carries water up to the leaves.' },
      { key: 'leaf', name: 'Leaf', text: 'The long leaves make food from sunlight.' },
      { key: 'fruit', name: 'Fruit', text: 'The fruit is sweet and has one big seed inside.' },
    ],
  },
];

export function getPlant(id: string): Plant | undefined {
  return PLANTS.find((p) => p.id === id);
}

export function getWorld(id: WorldId): World {
  return WORLDS.find((w) => w.id === id) ?? WORLDS[0];
}

export function plantsInWorld(id: WorldId): Plant[] {
  return PLANTS.filter((p) => p.world === id);
}
