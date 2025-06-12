import { Platform } from 'react-native';
import { backblazeService, B2FileInfo } from './backblazeApi';
import { Sound, Category } from '@/types/sound';

// Sound categories based on common audio file naming patterns
const CATEGORY_PATTERNS = {
  nature: ['rain', 'ocean', 'forest', 'bird', 'water', 'wind', 'thunder', 'storm'],
  meditation: ['meditation', 'zen', 'om', 'chant', 'mindful', 'breath', 'calm'],
  sleep: ['sleep', 'lullaby', 'night', 'dream', 'bedtime', 'rest'],
  focus: ['focus', 'concentration', 'study', 'work', 'productivity', 'white noise', 'brown noise'],
  ambient: ['ambient', 'atmosphere', 'space', 'drone', 'pad', 'texture'],
  music: ['music', 'melody', 'song', 'instrumental', 'piano', 'guitar'],
  urban: ['city', 'traffic', 'cafe', 'street', 'urban', 'crowd'],
  animals: ['cat', 'dog', 'whale', 'dolphin', 'cricket', 'frog', 'animal']
};

const CATEGORY_IMAGES = {
  nature: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
  meditation: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg',
  sleep: 'https://images.pexels.com/photos/3642711/pexels-photo-3642711.jpeg',
  focus: 'https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg',
  ambient: 'https://images.pexels.com/photos/396547/pexels-photo-396547.jpeg',
  music: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
  urban: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg',
  animals: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg'
};

const DEFAULT_SOUND_IMAGES = [
  'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg',
  'https://images.pexels.com/photos/1076429/pexels-photo-1076429.jpeg',
  'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg',
  'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg',
  'https://images.pexels.com/photos/3608881/pexels-photo-3608881.jpeg',
  'https://images.pexels.com/photos/2097616/pexels-photo-2097616.jpeg',
  'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg'
];

class SoundService {
  private sounds: Sound[] = [];
  private categories: Category[] = [];

  private categorizeSound(fileName: string): string {
    const lowerFileName = fileName.toLowerCase();
    
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
      if (patterns.some(pattern => lowerFileName.includes(pattern))) {
        return category;
      }
    }
    
    return 'ambient'; // Default category
  }

  private formatSoundTitle(fileName: string): string {
    // Remove file extension and replace underscores/hyphens with spaces
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private getRandomImage(): string {
    return DEFAULT_SOUND_IMAGES[Math.floor(Math.random() * DEFAULT_SOUND_IMAGES.length)];
  }

  private convertB2FileToSound(file: B2FileInfo): Sound {
    const category = this.categorizeSound(file.fileName);
    const title = this.formatSoundTitle(file.fileName);
    const audioUrl = backblazeService.getDownloadUrl(file.fileName);
    
    // Estimate duration based on file size (rough approximation)
    const estimatedDuration = Math.max(60, Math.min(600, Math.floor(file.contentLength / 50000)));
    
    return {
      id: file.fileId,
      title,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      imageUrl: this.getRandomImage(),
      audioUrl,
      description: `A ${category} sound perfect for relaxation and focus.`,
      isPremium: Math.random() > 0.7, // 30% chance of being premium
      duration: estimatedDuration
    };
  }

  async loadSounds(): Promise<void> {
    // Use mock data on web platform to avoid CORS issues
    if (Platform.OS === 'web') {
      console.log('Loading mock sounds for web platform...');
      this.loadMockData();
      return;
    }

    try {
      console.log('Loading sounds from Backblaze...');
      const files = await backblazeService.listFiles();
      console.log(`Found ${files.length} audio files`);
      
      this.sounds = files.map(file => this.convertB2FileToSound(file));
      
      // Generate categories based on loaded sounds
      this.generateCategories();
      
      console.log(`Loaded ${this.sounds.length} sounds in ${this.categories.length} categories`);
    } catch (error) {
      console.error('Error loading sounds:', error);
      // Fallback to mock data if API fails
      this.loadMockData();
    }
  }

  private generateCategories(): void {
    const categoryMap = new Map<string, number>();
    
    // Count sounds per category
    this.sounds.forEach(sound => {
      const count = categoryMap.get(sound.category) || 0;
      categoryMap.set(sound.category, count + 1);
    });
    
    // Create category objects
    this.categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      imageUrl: CATEGORY_IMAGES[name.toLowerCase() as keyof typeof CATEGORY_IMAGES] || CATEGORY_IMAGES.ambient,
      soundCount: count
    }));
  }

  private loadMockData(): void {
    // Fallback mock data
    this.sounds = [
      {
        id: 'mock-1',
        title: 'Rainforest Ambience',
        category: 'Nature',
        imageUrl: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg',
        audioUrl: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
        description: 'Soothing rainforest sounds for relaxation.',
        isPremium: false,
        duration: 180
      },
      {
        id: 'mock-2',
        title: 'Ocean Waves',
        category: 'Nature',
        imageUrl: 'https://images.pexels.com/photos/1076429/pexels-photo-1076429.jpeg',
        audioUrl: 'https://www.soundjay.com/misc/sounds/ocean-01.mp3',
        description: 'Calming ocean waves for sleep and meditation.',
        isPremium: false,
        duration: 240
      }
    ];
    
    this.generateCategories();
  }

  getSounds(): Sound[] {
    return this.sounds;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getSoundsByCategory(categoryId: string): Sound[] {
    const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    return this.sounds.filter(sound => sound.category === categoryName);
  }

  getFeaturedSounds(): Sound[] {
    return this.sounds.slice(0, 6);
  }

  getRecentSounds(): Sound[] {
    return this.sounds.slice(-6);
  }

  getSoundById(id: string): Sound | null {
    return this.sounds.find(sound => sound.id === id) || null;
  }

  searchSounds(query: string): Sound[] {
    const lowerQuery = query.toLowerCase();
    return this.sounds.filter(sound => 
      sound.title.toLowerCase().includes(lowerQuery) ||
      sound.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const soundService = new SoundService();