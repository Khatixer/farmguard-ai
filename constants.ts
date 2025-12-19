
import { Remedy } from './types';

export const REMEDIES: Remedy[] = [
  {
    id: 'baking-soda-spray',
    name: 'Baking Soda Antifungal Spray',
    description: 'An effective, non-toxic remedy for powdery mildew and early blight.',
    ingredients: [
      '1 tablespoon baking soda',
      '1/2 teaspoon liquid soap (non-detergent)',
      '1 gallon of water'
    ],
    steps: [
      'Mix baking soda and liquid soap into the water.',
      'Pour the mixture into a clean spray bottle.',
      'Spray affected leaves thoroughly in the early morning or late evening.',
      'Repeat every 7-10 days until resolved.'
    ],
    targetDisease: 'Powdery Mildew / Blight'
  },
  {
    id: 'neem-oil-mix',
    name: 'Organic Neem Oil Solution',
    description: 'Natural insecticide and fungicide suitable for almost all garden pests.',
    ingredients: [
      '2 teaspoons pure neem oil',
      '1 teaspoon mild dish soap',
      '1 liter of warm water'
    ],
    steps: [
      'Add dish soap to warm water to act as an emulsifier.',
      'Slowly add neem oil and shake well.',
      'Apply to all plant surfaces including the undersides of leaves.',
      'Avoid application during direct sunlight to prevent leaf burn.'
    ],
    targetDisease: 'Pests / Rust / Mildew'
  },
  {
    id: 'garlic-chili-spray',
    name: 'Garlic & Chili Pest Repellent',
    description: 'Strong repellent for aphids, mites, and caterpillars.',
    ingredients: [
      '2 heads of garlic',
      '2 teaspoons hot pepper powder (or fresh chilis)',
      '1 liter of water',
      '1 teaspoon dish soap'
    ],
    steps: [
      'Blend garlic and chilis with a small amount of water.',
      'Let sit overnight, then strain through cheesecloth.',
      'Mix with the rest of the water and soap.',
      'Spray on affected areas twice a week.'
    ],
    targetDisease: 'Aphids / Mites'
  }
];

export const MOCK_HISTORY = [
  {
    id: '1',
    plantName: 'Tomato',
    disease: 'Early Blight',
    confidence: 0.89,
    remedyId: 'baking-soda-spray',
    timestamp: Date.now() - 172800000, // 2 days ago
    imageUrl: 'https://picsum.photos/seed/tomato1/400/300',
    isTreated: true
  },
  {
    id: '2',
    plantName: 'Cucumber',
    disease: 'Powdery Mildew',
    confidence: 0.94,
    remedyId: 'baking-soda-spray',
    timestamp: Date.now() - 86400000, // 1 day ago
    imageUrl: 'https://picsum.photos/seed/cuke1/400/300',
    isTreated: false
  }
];
