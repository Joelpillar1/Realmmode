import { Sound, Category } from '@/types/sound';

export const categories: Category[] = [
  {
    id: 'nature',
    name: 'Nature',
    imageUrl: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    imageUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    imageUrl: 'https://images.pexels.com/photos/3642711/pexels-photo-3642711.jpeg',
  },
  {
    id: 'focus',
    name: 'Focus',
    imageUrl: 'https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    imageUrl: 'https://images.pexels.com/photos/396547/pexels-photo-396547.jpeg',
  },
];

export const featuredSounds: Sound[] = [
  {
    id: '1',
    title: 'Rainforest Ambience',
    category: 'Nature',
    imageUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1ed1e5c36.mp3',
    description: 'Immerse yourself in the soothing sounds of a tropical rainforest. Perfect for relaxation and stress relief.',
    isPremium: false,
    duration: 180,
  },
  {
    id: '2',
    title: 'Ocean Waves',
    category: 'Nature',
    imageUrl: 'https://images.pexels.com/photos/1076429/pexels-photo-1076429.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3',
    description: 'Let the rhythmic sound of ocean waves calm your mind and help you focus or sleep.',
    isPremium: false,
    duration: 240,
  },
  {
    id: '3',
    title: 'Deep Meditation',
    category: 'Meditation',
    imageUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    description: 'A carefully crafted sound experience designed to guide you into a state of deep meditation.',
    isPremium: true,
    duration: 300,
  },
  {
    id: '4',
    title: 'Thunderstorm',
    category: 'Sleep',
    imageUrl: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_6e059c5d60.mp3',
    description: 'The distant rumble of thunder and gentle rain creates a perfect backdrop for sleep.',
    isPremium: false,
    duration: 240,
  },
];

export const recentSounds: Sound[] = [
  {
    id: '5',
    title: 'Campfire',
    category: 'Ambient',
    imageUrl: 'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_c4e667dd0c.mp3',
    description: 'The crackling sounds of a cozy campfire to help you relax and unwind.',
    isPremium: false,
    duration: 210,
  },
  {
    id: '6',
    title: 'Study Focus',
    category: 'Focus',
    imageUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/19/audio_270cbe5e0f.mp3',
    description: 'Designed to enhance concentration and productivity during study or work sessions.',
    isPremium: true,
    duration: 270,
  },
  {
    id: '7',
    title: 'Wind Chimes',
    category: 'Meditation',
    imageUrl: 'https://images.pexels.com/photos/2097616/pexels-photo-2097616.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_20cb2a5e3d.mp3',
    description: 'Delicate wind chimes create a peaceful atmosphere for meditation and mindfulness.',
    isPremium: false,
    duration: 190,
  },
  {
    id: '8',
    title: 'Night Jungle',
    category: 'Sleep',
    imageUrl: 'https://images.pexels.com/photos/3608881/pexels-photo-3608881.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3',
    description: 'Experience the magical sounds of a jungle at night as you drift off to sleep.',
    isPremium: true,
    duration: 320,
  },
];

export const favoriteSounds: Sound[] = [
  {
    id: '2',
    title: 'Ocean Waves',
    category: 'Nature',
    imageUrl: 'https://images.pexels.com/photos/1076429/pexels-photo-1076429.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3',
    description: 'Let the rhythmic sound of ocean waves calm your mind and help you focus or sleep.',
    isPremium: false,
    duration: 240,
  },
  {
    id: '4',
    title: 'Thunderstorm',
    category: 'Sleep',
    imageUrl: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_6e059c5d60.mp3',
    description: 'The distant rumble of thunder and gentle rain creates a perfect backdrop for sleep.',
    isPremium: false,
    duration: 240,
  },
];

export const recentlyPlayedSounds: Sound[] = [
  {
    id: '1',
    title: 'Rainforest Ambience',
    category: 'Nature',
    imageUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1ed1e5c36.mp3',
    description: 'Immerse yourself in the soothing sounds of a tropical rainforest. Perfect for relaxation and stress relief.',
    isPremium: false,
    duration: 180,
  },
  {
    id: '5',
    title: 'Campfire',
    category: 'Ambient',
    imageUrl: 'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_c4e667dd0c.mp3',
    description: 'The crackling sounds of a cozy campfire to help you relax and unwind.',
    isPremium: false,
    duration: 210,
  },
  {
    id: '3',
    title: 'Deep Meditation',
    category: 'Meditation',
    imageUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    description: 'A carefully crafted sound experience designed to guide you into a state of deep meditation.',
    isPremium: true,
    duration: 300,
  },
];

// Combine all sounds for search
export const allSounds: Sound[] = [...featuredSounds, ...recentSounds];

// Helper function to get a sound by ID
export function getSoundById(id: string): Sound | null {
  return allSounds.find(sound => sound.id === id) || null;
}