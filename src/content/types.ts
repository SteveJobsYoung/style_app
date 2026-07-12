export type ArchetypeId = 'ruler' | 'lover' | 'rebel' | 'magician';

export type BodyTypeId = 'slim-short' | 'slim-tall' | 'solid-short' | 'solid-tall';

export type FaceTypeId = 'soft' | 'balanced' | 'hard';

export type FaceShapeId =
  | 'square'
  | 'oval'
  | 'rectangle'
  | 'round'
  | 'diamond'
  | 'triangle';

export interface QuizAnswer {
  text: string;
  archetype: ArchetypeId;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[]; // ровно 5, по одному на архетип
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  vibeName: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  styleIds: string[];
  accessories: string[];
}

export interface StyleItem {
  id: string;
  name: string;
  description: string;
  whyFits: string;
  image: string;
  pinterestUrl: string;
}

export interface BodyType {
  id: BodyTypeId;
  name: string;
  description: string;
  image: string;
  fitRules: string[];
}

export interface Palette {
  name: string;
  colors: { hex: string; name: string }[];
}

export interface FaceType {
  id: FaceTypeId;
  name: string;
  description: string;
  image: string;
  primaryPalette: 'light' | 'dark' | 'both';
  paletteNote: string;
  beardRules: string[];
}

export interface Hairstyle {
  name: string;
  image: string;
  pinterestUrl: string;
}

export interface FaceShape {
  id: FaceShapeId;
  name: string;
  description: string;
  image: string;
  hairRules: string[];
  hairstyles: Hairstyle[];
}
