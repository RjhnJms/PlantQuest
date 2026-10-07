import type { PartKey } from './plants';

export type Level = 'sprout' | 'sapling';

type Base = {
  id: string;
  /** Plant-specific questions make up that plant's quiz on the adventure path. */
  plantId?: string;
  level: Level;
  prompt: string;
  /** One sentence shown (and read) after answering. */
  explain: string;
};

export type ChoiceQuestion = Base & { kind: 'choice'; options: string[]; answer: number };
export type PictureQuestion = Base & { kind: 'picture'; options: string[]; answer: number };
export type TapQuestion = Base & { kind: 'tap'; plantId: string; answer: PartKey };
export type Question = ChoiceQuestion | PictureQuestion | TapQuestion;

export const LEVELS: Record<Level, { name: string; grades: string; length: number }> = {
  sprout: { name: 'Sprout', grades: 'Grades 1–4', length: 5 },
  sapling: { name: 'Sapling', grades: 'Grades 5–6', length: 10 },
};

export function levelForGrade(grade: number | null): Level {
  return grade !== null && grade >= 5 ? 'sapling' : 'sprout';
}

// DRAFT: facts and questions must be checked by a science teacher before release.
export const QUESTIONS: Question[] = [
  // World 1: Bakuran
  { id: 'sam-1', plantId: 'sampaguita', level: 'sprout', kind: 'picture', prompt: 'Which is the national flower of the Philippines?', options: ['gumamela', 'makahiya', 'sampaguita', 'kalamansi'], answer: 2, explain: 'Sampaguita is the national flower of the Philippines.' },
  { id: 'sam-2', plantId: 'sampaguita', level: 'sprout', kind: 'choice', prompt: 'What color are sampaguita flowers?', options: ['Red', 'Yellow', 'White', 'Blue'], answer: 2, explain: 'Sampaguita flowers are small and white.' },
  { id: 'sam-3', plantId: 'sampaguita', level: 'sprout', kind: 'choice', prompt: 'When do sampaguita flowers open?', options: ['In the evening', 'Only in winter', 'Never', 'At noon only'], answer: 0, explain: 'They open in the evening and smell sweetest then.' },

  { id: 'gum-1', plantId: 'gumamela', level: 'sprout', kind: 'tap', prompt: 'Tap the big, bright flower.', answer: 'flower', explain: 'Gumamela has a big, bright flower.' },
  { id: 'gum-2', plantId: 'gumamela', level: 'sprout', kind: 'choice', prompt: 'What can kids make with crushed gumamela?', options: ['Soap bubbles', 'Paper', 'Glue', 'Ice cream'], answer: 0, explain: 'Crushed gumamela in water makes bubble juice.' },
  { id: 'gum-3', plantId: 'gumamela', level: 'sprout', kind: 'choice', prompt: 'The long tube in the middle of a gumamela flower holds the…', options: ['Roots', 'Pollen', 'Leaves', 'Water'], answer: 1, explain: 'The long tube holds the pollen.' },

  { id: 'mak-1', plantId: 'makahiya', level: 'sprout', kind: 'choice', prompt: 'What happens when you touch makahiya leaves?', options: ['They fold up', 'They grow bigger', 'They change color', 'They fall off'], answer: 0, explain: 'Makahiya leaves fold up when touched.' },
  { id: 'mak-2', plantId: 'makahiya', level: 'sprout', kind: 'choice', prompt: 'What does the word makahiya mean?', options: ['Shy', 'Happy', 'Tall', 'Sweet'], answer: 0, explain: 'Makahiya means shy, like the leaves that hide.' },
  { id: 'mak-3', plantId: 'makahiya', level: 'sprout', kind: 'tap', prompt: 'Tap a fluffy pink flower.', answer: 'flower', explain: 'Makahiya flowers look like fluffy pink balls.' },

  { id: 'kal-1', plantId: 'kalamansi', level: 'sprout', kind: 'choice', prompt: 'How does kalamansi taste?', options: ['Sour', 'Salty', 'Spicy', 'Bitter'], answer: 0, explain: 'Kalamansi is sour and full of juice.' },
  { id: 'kal-2', plantId: 'kalamansi', level: 'sprout', kind: 'tap', prompt: 'Tap a small round fruit.', answer: 'fruit', explain: 'The small round fruits are kalamansi.' },
  { id: 'kal-3', plantId: 'kalamansi', level: 'sprout', kind: 'choice', prompt: 'What color is a very ripe kalamansi?', options: ['Orange', 'Blue', 'Purple', 'White'], answer: 0, explain: 'Kalamansi turns from green to orange when very ripe.' },

  { id: 'mal-1', plantId: 'malunggay', level: 'sprout', kind: 'picture', prompt: 'Which plant has tiny round leaves that families cook in soup?', options: ['malunggay', 'gumamela', 'kalamansi', 'sampaguita'], answer: 0, explain: 'Malunggay leaves are cooked in soup.' },
  { id: 'mal-2', plantId: 'malunggay', level: 'sprout', kind: 'tap', prompt: 'Tap a long pod. It holds the seeds.', answer: 'fruit', explain: 'The long pods are fruits that hold the seeds.' },
  { id: 'mal-3', plantId: 'malunggay', level: 'sprout', kind: 'choice', prompt: 'One malunggay leaf is made of many tiny…', options: ['Leaflets', 'Flowers', 'Roots', 'Thorns'], answer: 0, explain: 'One malunggay leaf has many tiny leaflets.' },

  // World 2: Bukid
  { id: 'man-1', plantId: 'mango', level: 'sprout', kind: 'choice', prompt: 'Which mango from the Philippines is famous around the world?', options: ['Carabao mango', 'Snow mango', 'Desert mango', 'Blue mango'], answer: 0, explain: 'The sweet carabao mango is famous around the world.' },
  { id: 'man-2', plantId: 'mango', level: 'sprout', kind: 'tap', prompt: 'Tap the trunk, the woody stem.', answer: 'stem', explain: 'A tree trunk is a hard, woody stem.' },
  { id: 'man-3', plantId: 'mango', level: 'sprout', kind: 'choice', prompt: 'How many seeds are inside a mango fruit?', options: ['None', 'One big seed', 'Hundreds', 'Ten'], answer: 1, explain: 'A mango has one big seed inside.' },

  // Sprout (Grades 1–4): parts, needs, kinds of plants
  { id: 'sp-1', level: 'sprout', kind: 'choice', prompt: 'Which part of the plant takes in water and minerals from the soil?', options: ['Leaf', 'Stem', 'Root', 'Flower'], answer: 2, explain: 'Roots take in water and minerals from the soil.' },
  { id: 'sp-2', level: 'sprout', kind: 'choice', prompt: 'Which part of the plant makes food using sunlight?', options: ['Root', 'Leaf', 'Seed', 'Thorn'], answer: 1, explain: 'Leaves use sunlight to make food.' },
  { id: 'sp-3', level: 'sprout', kind: 'choice', prompt: 'What does a plant need to grow?', options: ['Water, sunlight and air', 'Candy and toys', 'Only darkness', 'Only rocks'], answer: 0, explain: 'Plants need water, sunlight, air and soil.' },
  { id: 'sp-4', level: 'sprout', kind: 'choice', prompt: 'Which part carries water from the roots to the leaves?', options: ['Flower', 'Stem', 'Seed', 'Petal'], answer: 1, explain: 'The stem carries water up to the leaves.' },
  { id: 'sp-5', level: 'sprout', kind: 'choice', prompt: 'A big plant with one thick, woody trunk is a…', options: ['Grass', 'Herb', 'Tree', 'Vine'], answer: 2, explain: 'A tree has one thick, woody trunk.' },
  { id: 'sp-6', level: 'sprout', kind: 'choice', prompt: 'A plant with a soft, weak stem that climbs is a…', options: ['Vine', 'Tree', 'Shrub', 'Grass'], answer: 0, explain: 'A vine has a weak stem that climbs or creeps.' },
  { id: 'sp-7', level: 'sprout', kind: 'choice', prompt: 'What happens to a plant with no water?', options: ['It grows faster', 'It wilts and dries', 'It turns blue', 'Nothing'], answer: 1, explain: 'Without water, a plant wilts and dries up.' },
  { id: 'sp-8', level: 'sprout', kind: 'choice', prompt: 'Which part of the plant often becomes a fruit?', options: ['Root', 'Leaf', 'Flower', 'Stem'], answer: 2, explain: 'Flowers can turn into fruits with seeds inside.' },
  { id: 'sp-9', level: 'sprout', kind: 'picture', prompt: 'Which plant folds its leaves when you touch it?', options: ['gumamela', 'makahiya', 'mango', 'kalamansi'], answer: 1, explain: 'Makahiya leaves fold up when touched.' },
  { id: 'sp-10', level: 'sprout', kind: 'choice', prompt: 'Which part holds the plant in the ground?', options: ['Root', 'Flower', 'Leaf', 'Fruit'], answer: 0, explain: 'Roots hold the plant in the ground.' },

  // Sapling (Grades 5–6): flowers, pollination, seeds and spores, reproduction
  { id: 'sa-1', level: 'sapling', kind: 'choice', prompt: 'Which part of the flower makes pollen?', options: ['Stamen', 'Pistil', 'Sepal', 'Root'], answer: 0, explain: 'The stamen is the male part. It makes pollen.' },
  { id: 'sa-2', level: 'sapling', kind: 'choice', prompt: 'Which part of the flower receives pollen and grows the seeds?', options: ['Petal', 'Stamen', 'Pistil', 'Stem'], answer: 2, explain: 'The pistil is the female part. Seeds form inside it.' },
  { id: 'sa-3', level: 'sapling', kind: 'choice', prompt: 'What is pollination?', options: ['Moving pollen to the pistil', 'Watering a plant', 'Cutting leaves', 'Planting a seed'], answer: 0, explain: 'Pollination moves pollen from the stamen to the pistil.' },
  { id: 'sa-4', level: 'sapling', kind: 'choice', prompt: 'Which of these helps carry pollen?', options: ['Bees', 'Stones', 'Plastic', 'Clouds'], answer: 0, explain: 'Bees, butterflies, birds and wind carry pollen.' },
  { id: 'sa-5', level: 'sapling', kind: 'choice', prompt: 'What protects the flower bud before it opens?', options: ['Sepals', 'Roots', 'Pollen', 'Seeds'], answer: 0, explain: 'Sepals are small green leaves that protect the bud.' },
  { id: 'sa-6', level: 'sapling', kind: 'choice', prompt: 'Ferns and mosses make new plants from…', options: ['Seeds', 'Spores', 'Fruits', 'Bulbs'], answer: 1, explain: 'Ferns and mosses grow from spores, not seeds.' },
  { id: 'sa-7', level: 'sapling', kind: 'choice', prompt: 'Growing a new plant from a stem cutting is called…', options: ['Pollination', 'Vegetative propagation', 'Photosynthesis', 'Wilting'], answer: 1, explain: 'Vegetative propagation grows new plants from roots, stems or leaves.' },
  { id: 'sa-8', level: 'sapling', kind: 'choice', prompt: 'How can seeds travel to new places?', options: ['By wind, water and animals', 'They never move', 'Only by car', 'By magnets'], answer: 0, explain: 'Wind, water and animals carry seeds far away.' },
  { id: 'sa-9', level: 'sapling', kind: 'choice', prompt: 'Why are flowers often bright and sweet-smelling?', options: ['To attract pollinators', 'To scare animals', 'To store water', 'To make spores'], answer: 0, explain: 'Bright colors and smells attract pollinators like bees.' },
  { id: 'sa-10', level: 'sapling', kind: 'choice', prompt: 'What gas do plants give off when they make food?', options: ['Oxygen', 'Smoke', 'Helium', 'Steam'], answer: 0, explain: 'Plants give off oxygen when they make food.' },
  { id: 'sa-11', level: 'sapling', kind: 'choice', prompt: 'What does a seed need to start growing?', options: ['Water, air and warmth', 'Darkness only', 'Salt', 'Ice'], answer: 0, explain: 'Seeds need water, air and warmth to sprout.' },
  { id: 'sa-12', level: 'sapling', kind: 'choice', prompt: 'After pollination, the ovary of the flower becomes the…', options: ['Root', 'Fruit', 'Leaf', 'Stem'], answer: 1, explain: 'The ovary grows into a fruit that holds the seeds.' },
];

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function plantQuiz(plantId: string): Question[] {
  return shuffle(QUESTIONS.filter((q) => q.plantId === plantId));
}

/** Level quiz: that level's general questions, plus (for Sprout) plant questions so the pool stays varied. */
export function levelQuiz(level: Level): Question[] {
  const pool = QUESTIONS.filter((q) => (q.plantId ? level === 'sprout' : q.level === level));
  return shuffle(pool).slice(0, LEVELS[level].length);
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
