export interface MovieInterface {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
}

export interface SeriesInterface {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  bannerUrl?: string;
}

export interface EpisodeInterface {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}
