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

export type Plant = {
  id: string;
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

// Order here is the order of stops on the Home adventure path.
export const PLANTS: Plant[] = [
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    theme: { main: colors.sun, dark: colors.sunDark, pale: colors.sunPale },
    short: 'A tall flower that follows the sun.',
    intro: 'The sunflower is a tall, bright flower. Young sunflowers turn to face the sun.',
    funFact: 'A sunflower head is made of hundreds of tiny flowers. Each one can become a seed.',
    parts: [
      { key: 'root', name: 'Root', text: 'The root goes deep into the soil to drink water.' },
      { key: 'stem', name: 'Stem', text: 'The tall stem holds the flower up and carries water to the top.' },
      { key: 'leaf', name: 'Leaf', text: 'The big leaves use sunlight to make food for the plant.' },
      { key: 'flower', name: 'Flower', text: 'The flower head makes seeds that birds and people love to eat.' },
    ],
  },
  {
    id: 'fern',
    name: 'Fern',
    scientificName: 'Nephrolepis exaltata',
    theme: { main: colors.teal, dark: colors.tealDark, pale: colors.tealPale },
    short: 'A green plant that grows in shady places.',
    intro: 'Ferns are green plants that like shady, wet places. They have no flowers and no seeds.',
    funFact: 'Ferns lived on Earth even before the dinosaurs!',
    parts: [
      { key: 'root', name: 'Root', text: 'Thin roots hold the fern in the soil and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The stem holds up the long leaves, called fronds.' },
      { key: 'leaf', name: 'Frond', text: 'A fern leaf is called a frond. It makes food from sunlight.' },
      { key: 'spores', name: 'Spores', text: 'Tiny dots under the frond hold spores. Spores grow into new ferns.' },
    ],
  },
  {
    id: 'cactus',
    name: 'Cactus',
    scientificName: 'Carnegiea gigantea',
    theme: { main: colors.leaf, dark: colors.leafDark, pale: colors.leafPale },
    short: 'A plant that stores water.',
    intro: 'A cactus lives in hot, dry places. It stores water inside its thick stem.',
    funFact: 'The spines of a cactus are its leaves! They help it keep water in.',
    parts: [
      { key: 'root', name: 'Root', text: 'Wide roots spread near the top of the soil to catch rain fast.' },
      { key: 'stem', name: 'Stem', text: 'The thick green stem stores water and makes food.' },
      { key: 'leaf', name: 'Spines', text: 'Spines are the leaves of a cactus. They protect it from animals.' },
      { key: 'flower', name: 'Flower', text: 'Cactus flowers bloom on top and turn into fruit.' },
    ],
  },
  {
    id: 'rose',
    name: 'Rose',
    scientificName: 'Rosa',
    theme: { main: colors.rose, dark: '#D63E55', pale: colors.pinkPale },
    short: 'A beautiful flower with thorns.',
    intro: 'The rose is a sweet-smelling flower. Its stem has sharp thorns.',
    funFact: 'After a rose flower dries, it can make a small fruit called a rose hip.',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the rose bush in the ground and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The stem has sharp thorns that keep animals from eating it.' },
      { key: 'leaf', name: 'Leaf', text: 'The leaves have jagged edges and make food from sunlight.' },
      { key: 'flower', name: 'Flower', text: 'The colorful petals and sweet smell call bees to the flower.' },
    ],
  },
  {
    id: 'mango',
    name: 'Mango',
    scientificName: 'Mangifera indica',
    theme: { main: colors.coral, dark: colors.coralDark, pale: colors.coralPale },
    short: 'A big tree with sweet fruit.',
    intro: 'The mango is a big tree. Its sweet fruit is the national fruit of the Philippines.',
    funFact: 'A mango tree can live for more than 100 years and keep making fruit.',
    parts: [
      { key: 'root', name: 'Root', text: 'A long main root grows deep to hold up the big tree.' },
      { key: 'stem', name: 'Trunk', text: 'The trunk is a hard, woody stem. It carries water up to the leaves.' },
      { key: 'leaf', name: 'Leaf', text: 'The long leaves make food from sunlight.' },
      { key: 'fruit', name: 'Fruit', text: 'The fruit is sweet and has one big seed inside.' },
    ],
  },
  {
    id: 'sampaguita',
    name: 'Sampaguita',
    scientificName: 'Jasminum sambac',
    theme: { main: colors.grape, dark: colors.grapeDark, pale: colors.grapePale },
    short: 'A small white flower that smells sweet.',
    intro: 'Sampaguita is the national flower of the Philippines. Its small white flowers smell very sweet.',
    funFact: 'Sampaguita flowers open in the evening. That is when their smell is strongest.',
    parts: [
      { key: 'root', name: 'Root', text: 'Roots hold the plant in the soil and drink water.' },
      { key: 'stem', name: 'Stem', text: 'The thin stem can climb and spread like a vine.' },
      { key: 'leaf', name: 'Leaf', text: 'Shiny green leaves make food from sunlight.' },
      { key: 'flower', name: 'Flower', text: 'The white flowers are used to make garlands called leis.' },
    ],
  },
];

export function getPlant(id: string): Plant | undefined {
  return PLANTS.find((p) => p.id === id);
}
