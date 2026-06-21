import type { TreasureDefinition, Stage } from '@/types'

export const TREASURE_DEFINITIONS: TreasureDefinition[] = [
  { id: 'zobo-cola',        name: 'Zobo Cola',        rows: 1, cols: 3 },
  { id: 'zobo-zine',        name: 'Zobo Zine',        rows: 2, cols: 2 },
  { id: 'syringe',          name: 'Syringe',          rows: 1, cols: 2 },
  { id: 'trumpet',          name: 'Trumpet',          rows: 1, cols: 3 },
  { id: 'outdated-console', name: 'Outdated Console', rows: 1, cols: 2 },
  { id: 'radio',            name: 'Radio',            rows: 2, cols: 3 },
  { id: 'pirated-magazine', name: 'Pirated Magazine', rows: 2, cols: 2 },
  { id: 'tv',               name: 'TV',               rows: 2, cols: 3 },
  { id: 'cyberlimb',        name: 'Cyberlimb',        rows: 1, cols: 4 },
  { id: 'spaceship',        name: 'Spaceship',        rows: 3, cols: 3 },
  { id: 'statue',           name: 'Statue',           rows: 2, cols: 4 },
]

export const STAGES: Stage[] = [
  {
    id: 1,
    size: 5,
    pickaxesPerTile: 15,
    reward: '60 Pinballs',
    treasures: [{ definitionId: 'zobo-cola', count: 3 }],
  },
  {
    id: 2,
    size: 5,
    pickaxesPerTile: 15,
    reward: '10 Critter Capsules',
    treasures: [
      { definitionId: 'zobo-zine', count: 1 },
      { definitionId: 'syringe', count: 3 },
    ],
  },
  {
    id: 3,
    size: 5,
    pickaxesPerTile: 15,
    reward: '1 Key + 228k Candy',
    treasures: [
      { definitionId: 'trumpet', count: 1 },
      { definitionId: 'zobo-zine', count: 1 },
      { definitionId: 'outdated-console', count: 2 },
    ],
  },
  {
    id: 4,
    size: 6,
    pickaxesPerTile: 20,
    reward: '180 Pinballs',
    treasures: [
      { definitionId: 'zobo-cola', count: 1 },
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'radio', count: 1 },
    ],
  },
  {
    id: 5,
    size: 6,
    pickaxesPerTile: 20,
    reward: '15 Critter Capsules',
    treasures: [
      { definitionId: 'pirated-magazine', count: 2 },
      { definitionId: 'zobo-zine', count: 2 },
    ],
  },
  {
    id: 6,
    size: 6,
    pickaxesPerTile: 20,
    reward: '1 Key + 457k Candy',
    treasures: [
      { definitionId: 'zobo-cola', count: 2 },
      { definitionId: 'zobo-zine', count: 1 },
      { definitionId: 'tv', count: 1 },
    ],
  },
  {
    id: 7,
    size: 7,
    pickaxesPerTile: 25,
    reward: '240 Pinballs',
    treasures: [
      { definitionId: 'zobo-zine', count: 1 },
      { definitionId: 'radio', count: 1 },
      { definitionId: 'cyberlimb', count: 2 },
    ],
  },
  {
    id: 8,
    size: 7,
    pickaxesPerTile: 25,
    reward: '20 Critter Capsules',
    treasures: [
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'cyberlimb', count: 1 },
      { definitionId: 'spaceship', count: 1 },
    ],
  },
  {
    id: 9,
    size: 7,
    pickaxesPerTile: 25,
    reward: '1 Key + 914k Candy',
    treasures: [
      { definitionId: 'syringe', count: 2 },
      { definitionId: 'pirated-magazine', count: 2 },
      { definitionId: 'statue', count: 1 },
    ],
  },
  {
    id: 10,
    size: 7,
    pickaxesPerTile: 35,
    reward: '600 Pinballs',
    treasures: [
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'cyberlimb', count: 2 },
      { definitionId: 'spaceship', count: 1 },
    ],
  },
  {
    id: 11,
    size: 7,
    pickaxesPerTile: 35,
    reward: '25 Critter Capsules',
    treasures: [
      { definitionId: 'zobo-cola', count: 2 },
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'trumpet', count: 1 },
      { definitionId: 'statue', count: 1 },
    ],
  },
  {
    id: 12,
    size: 7,
    pickaxesPerTile: 35,
    reward: '1 Key + Candy',
    treasures: [],
  },
  {
    id: 13,
    size: 7,
    pickaxesPerTile: 70,
    reward: '700 Pinballs',
    treasures: [
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'statue', count: 2 },
    ],
  },
  {
    id: 14,
    size: 7,
    pickaxesPerTile: 70,
    reward: '25 Critter Capsules',
    treasures: [
      { definitionId: 'radio', count: 1 },
      { definitionId: 'cyberlimb', count: 2 },
      { definitionId: 'spaceship', count: 1 },
    ],
  },
  {
    id: 15,
    size: 7,
    pickaxesPerTile: 70,
    reward: '1 Key + 1,918k Candy',
    treasures: [
      { definitionId: 'zobo-cola', count: 2 },
      { definitionId: 'syringe', count: 2 },
      { definitionId: 'tv', count: 1 },
      { definitionId: 'statue', count: 2 },
    ],
  },
  {
    id: 16,
    size: 7,
    pickaxesPerTile: 100,
    reward: '800 Pinballs',
    treasures: [
      { definitionId: 'outdated-console', count: 2 },
      { definitionId: 'pirated-magazine', count: 2 },
      { definitionId: 'statue', count: 1 },
    ],
  },
]
