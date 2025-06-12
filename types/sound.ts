export interface Sound {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  audioUrl: string;
  description?: string;
  isPremium: boolean;
  duration: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  soundCount?: number;
}