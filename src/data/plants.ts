import { colors } from '@/lib/palette';

export type PartKey = 'root' | 'stem' | 'leaf' | 'flower' | 'fruit' | 'spores' | 'shoot';

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

  // World 2: Bukid (farm)
  {
    id: 'palay',
    world: 'bukid',
    name: 'Palay',
    scientificName: 'Oryza sativa',
    theme: { main: colors.sun, dark: colors.sunDark, pale: colors.sunPale },
    short: 'The rice plant. Rice is our main food.',
    intro: 'Palay is the rice plant. Rice is the main food of most Filipinos.',
    funFact: 'Palay is a kind of grass! Each grain of rice is a seed of the plant.',
    parts: [
      { key: 'root', name: 'Root', text: 'Many thin roots grow in the wet, muddy field.' },
      { key: 'stem', name: 'Stalk', text: 'The hollow stalk holds up the heavy grains.' },
      { key: 'leaf', name: 'Leaf', text: 'Long, thin leaves make food from sunlight.' },
      { key: 'fruit', name: 'Grain', text: 'Each grain is a seed of the plant. We cook it as rice.' },
    ],
  },
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
  {
    id: 'saba',
    world: 'bukid',
    name: 'Saba',
    scientificName: 'Musa (saba banana)',
    theme: { main: colors.leaf, dark: colors.leafDark, pale: colors.leafPale },
    short: 'A banana plant. It is a giant herb!',
    intro: 'Saba is a banana plant. Filipinos cook saba to make banana cue and turon.',
    funFact: 'A banana plant is not a tree. It is a giant herb! Its trunk is made of leaves rolled up tight.',
    parts: [
      { key: 'root', name: 'Root', text: 'Thick roots spread in the soil to drink water.' },
      { key: 'stem', name: 'Stem', text: 'The soft trunk is made of leaves rolled tightly together.' },
      { key: 'leaf', name: 'Leaf', text: 'The huge leaves are used to wrap food like suman.' },
      { key: 'fruit', name: 'Fruit', text: 'Bananas grow together in a big bunch. The purple puso hangs at the end.' },
    ],
  },
  {
    id: 'mongo',
    world: 'bukid',
    name: 'Mongo',
    scientificName: 'Vigna radiata',
    theme: { main: colors.teal, dark: colors.tealDark, pale: colors.tealPale },
    short: 'A small plant with pods of green beans.',
    intro: 'Mongo is a small plant. Its pods are full of little green beans that we cook in ginisang mongo.',
    funFact: 'Put mongo seeds on wet cotton and they sprout in just a day or two!',
    parts: [
      { key: 'root', name: 'Root', text: 'The root comes out first when the seed sprouts.' },
      { key: 'stem', name: 'Stem', text: 'The thin green stem grows up toward the light.' },
      { key: 'leaf', name: 'Leaf', text: 'Each leaf has three small leaflets.' },
      { key: 'fruit', name: 'Pod', text: 'The long pods hold the mongo beans. The beans are seeds.' },
    ],
  },
  {
    id: 'niyog',
    world: 'bukid',
    name: 'Niyog',
    scientificName: 'Cocos nucifera',
    theme: { main: '#A0703C', dark: '#7A5230', pale: '#F3E6D6' },
    short: 'The coconut palm, the tree of life.',
    intro: 'Niyog is the coconut palm. It is called the tree of life because people use every part of it.',
    funFact: 'A coconut can float on the sea and grow on a faraway beach!',
    parts: [
      { key: 'root', name: 'Root', text: 'Many thin roots spread out to hold up the tall palm.' },
      { key: 'stem', name: 'Trunk', text: 'The tall trunk has rings and no branches.' },
      { key: 'leaf', name: 'Frond', text: 'The long fronds are used to weave baskets and roofs.' },
      { key: 'fruit', name: 'Coconut', text: 'The coconut has sweet water and white meat inside.' },
    ],
  },

  // World 3: Kalikasan (nature)
  {
    id: 'narra',
    world: 'kalikasan',
    name: 'Narra',
    scientificName: 'Pterocarpus indicus',
    theme: { main: '#C8763D', dark: '#9A5428', pale: '#FBE9DA' },
    short: 'Our national tree, with hard, strong wood.',
    intro: 'Narra is the national tree of the Philippines. Its wood is hard and strong.',
    funFact: 'Narra seed pods are flat and round with a thin wing. The wind spins them far away!',
    parts: [
      { key: 'root', name: 'Root', text: 'Big roots spread out like walls at the bottom to hold up the tall tree.' },
      { key: 'stem', name: 'Trunk', text: 'The trunk has hard, reddish wood used for furniture.' },
      { key: 'leaf', name: 'Leaf', text: 'Many leaves make food and give cool shade.' },
      { key: 'fruit', name: 'Seed pod', text: 'Flat, round pods with a wing carry the seeds on the wind.' },
    ],
  },
  {
    id: 'kawayan',
    world: 'kalikasan',
    name: 'Kawayan',
    scientificName: 'Bambusa blumeana',
    theme: { main: colors.leaf, dark: colors.leafDark, pale: colors.leafPale },
    short: 'Bamboo, a giant grass that grows fast.',
    intro: 'Kawayan is bamboo. It is a giant grass that grows very fast.',
    funFact: 'Some kinds of bamboo can grow almost one meter in just one day!',
    parts: [
      { key: 'root', name: 'Root', text: 'Underground stems spread out and send up new shoots.' },
      { key: 'stem', name: 'Stem', text: 'The tall stem is hollow inside and has rings called nodes.' },
      { key: 'leaf', name: 'Leaf', text: 'Thin leaves grow on small branches.' },
      { key: 'shoot', name: 'Shoot', text: 'Young shoots called labong can be cooked and eaten.' },
    ],
  },
  {
    id: 'pako',
    world: 'kalikasan',
    name: 'Pako',
    scientificName: 'Diplazium esculentum',
    theme: { main: colors.teal, dark: colors.tealDark, pale: colors.tealPale },
    short: 'A fern that grows in wet, shady places.',
    intro: 'Pako is a fern that grows in wet, shady places. People cook its young leaves. It has no flowers and no seeds.',
    funFact: 'Young pako leaves are curled up like a snail shell. They unroll as they grow!',
    parts: [
      { key: 'root', name: 'Root', text: 'Thin roots hold the fern in the soil and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The stem holds up the long leaves, called fronds.' },
      { key: 'leaf', name: 'Frond', text: 'A fern leaf is called a frond. It makes food from sunlight.' },
      { key: 'spores', name: 'Spores', text: 'Tiny dots under the frond hold spores. Spores grow into new ferns.' },
    ],
  },
  {
    id: 'bakawan',
    world: 'kalikasan',
    name: 'Bakawan',
    scientificName: 'Rhizophora',
    theme: { main: colors.skyDark, dark: '#2F98D0', pale: colors.skyPale },
    short: 'A mangrove tree that grows in salty water.',
    intro: 'Bakawan is a mangrove tree. It grows in salty water along the coast.',
    funFact: 'Mangroves are like a wall. They protect villages from big waves and storms.',
    parts: [
      { key: 'root', name: 'Stilt roots', text: 'Stilt roots arch into the mud and hold the tree up above the water.' },
      { key: 'stem', name: 'Trunk', text: 'The trunk stands above the water on its stilt roots.' },
      { key: 'leaf', name: 'Leaf', text: 'Thick, shiny leaves can handle the salty air.' },
      { key: 'fruit', name: 'Seedling', text: 'Long seedlings grow on the tree, then drop into the mud to grow.' },
    ],
  },
  {
    id: 'kangkong',
    world: 'kalikasan',
    name: 'Kangkong',
    scientificName: 'Ipomoea aquatica',
    theme: { main: colors.grape, dark: colors.grapeDark, pale: colors.grapePale },
    short: 'A plant that floats and grows in water.',
    intro: 'Kangkong grows in water and wet places. Filipinos cook it in sinigang and adobo.',
    funFact: 'Kangkong stems are hollow and full of air. That is why it can float!',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hang down in the water to drink.' },
      { key: 'stem', name: 'Stem', text: 'The hollow stem floats on the water.' },
      { key: 'leaf', name: 'Leaf', text: 'The leaves are shaped like arrows.' },
      { key: 'flower', name: 'Flower', text: 'Its flowers are shaped like little trumpets.' },
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
