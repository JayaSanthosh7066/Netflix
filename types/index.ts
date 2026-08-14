export interface MovieInterface {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  genre: string;
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

export interface SeriesInterface {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string;
  bannerUrl?: string;

  createdAt: string;
  updatedAt: string;

  episodes?: EpisodeInterface[];
}

export interface ImageInterface {
  id: string;
  title: string | null;
  imageUrl: string;
  imageNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageSeriesInterface {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;

  createdAt: string;
  updatedAt: string;

  images?: ImageInterface[];
}
