// Destination URLs supplied by Mustofa; labels follow the Figma design.
export const links: Record<string, string | undefined> = {
  email: 'mailto:themustofano@gmail.com',
  selectedWork: '#selected-work',
  'Blissful Studio': 'https://blissful-studio.com/',
  X: 'https://x.com/themustofano',
  Dribbble: 'https://dribbble.com/themustofano',
  Instagram: 'https://www.instagram.com/themustofano',
  LinkedIn: 'https://www.linkedin.com/in/themustofano/',
  'Nora AI': 'https://www.norahq.com/',
  'AI or Not': 'https://www.aiornot.com/',
  Hinoki: 'https://hinoki.security/',
  TextQL: 'https://textql.com/customers',
  Luthor: 'https://www.luthor.ai/',
  Echovane: 'https://www.echovane.com/',
  'Invisible Details': 'https://invisibledetails.com/',
  Nucleus: 'https://nucleus-website-eight.vercel.app/',
  'Tally Inventory': 'https://tally-design-docs.vercel.app/',
  'Talent Pluto': 'https://talentpluto.com/',
};

export const work = [
  ['Nora AI', 'Product, Website', '2025'],
  ['AI or Not', 'Product, Website', '2025'],
  ['Hinoki', 'Website', '2026'],
  ['TextQL', 'Storyboard', '2026'],
  ['Luthor', 'Storyboard', '2026'],
  ['Echovane', 'Pitch Deck, Marketing, Product', '2026'],
  ['Invisible Details', 'Product, Website', '2026'],
  ['Nucleus', 'Product, Website', '2026'],
  ['Tally Inventory', 'Brand Docs', '2026'],
  ['Talent Pluto', 'Pitch Deck', '2026'],
] as const;

export const records = [
  ['Weighted dips', '25kg x 10reps'],
  ['Bodyweight pull-up', '12reps'],
  ['Weighted squat', '55kg x 10reps'],
  ['Static skills', 'Soon'],
] as const;

export const showcases = [
  { id: 'date', name: 'Date picker and notes', node: '4953:30', bounds: [111, 80, 478, 290] },
  { id: 'voice', name: 'Voice chat', node: '4941:381', bounds: [230, 136, 240, 254] },
  { id: 'nav', name: 'Product navigation', node: '4941:449', bounds: [70, 49.25, 560, 175] },
  { id: 'composer', name: 'Aspect ratio and prompt composer', node: '4941:531', bounds: [135, 235, 430, 130] },
  { id: 'agent', name: 'Agent selector', node: '4941:587', bounds: [125, 268, 450, 100] },
  { id: 'analytics', name: 'Analytics chart', node: '4995:2991', bounds: [111, 45.5, 478, 458] },
  { id: 'phone', name: 'Phone / AI Detector', node: '5015:1808', bounds: [0, 0, 700, 549] },
  { id: 'all-in-one', name: 'The All-in-One App Era Is Over', node: '5017:1963', bounds: [186, 32, 328, 526] },
  { id: 'future', name: 'Build What You Need / Future', node: '5017:2015', bounds: [155, 79, 390, 390] },
  { id: 'collective', name: 'D/G/TAL MAKER COLLECT/VE', node: '5017:3021', bounds: [200, 57, 300, 435] },
] as const;
export type ShowcaseId = typeof showcases[number]['id'];
