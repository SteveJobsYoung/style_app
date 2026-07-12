import { create } from 'zustand';
import type {
  ArchetypeId,
  BodyTypeId,
  FaceTypeId,
  FaceShapeId,
} from './content/types';

export type Screen =
  | 'welcome'
  | 'quiz'
  | 'archetype-result'
  | 'body'
  | 'face-type'
  | 'face-shape'
  | 'analyzing'
  | 'result';

export interface TestState {
  archetypes: ArchetypeId[]; // результат теста (1 или 2)
  bodyType: BodyTypeId | null;
  faceType: FaceTypeId | null;
  faceShape: FaceShapeId | null;
}

interface AppState extends TestState {
  screen: Screen;
  questionIndex: number;
  answers: ArchetypeId[]; // ответ на каждый вопрос по порядку

  setScreen: (s: Screen) => void;
  answerQuestion: (a: ArchetypeId) => void;
  goBackInQuiz: () => void;
  setTestArchetypes: (a: ArchetypeId[]) => void;
  setBodyType: (b: BodyTypeId) => void;
  setFaceType: (f: FaceTypeId) => void;
  setFaceShape: (f: FaceShapeId) => void;
  reset: () => void;
}

const initial: TestState & { screen: Screen; questionIndex: number; answers: ArchetypeId[] } = {
  screen: 'welcome',
  archetypes: [],
  bodyType: null,
  faceType: null,
  faceShape: null,
  questionIndex: 0,
  answers: [],
};

export const useApp = create<AppState>((set) => ({
  ...initial,

  setScreen: (screen) => set({ screen }),

  answerQuestion: (a) =>
    set((s) => {
      const answers = [...s.answers];
      answers[s.questionIndex] = a;
      return { answers, questionIndex: s.questionIndex + 1 };
    }),

  goBackInQuiz: () =>
    set((s) => ({ questionIndex: Math.max(0, s.questionIndex - 1) })),

  setTestArchetypes: (archetypes) => set({ archetypes }),
  setBodyType: (bodyType) => set({ bodyType }),
  setFaceType: (faceType) => set({ faceType }),
  setFaceShape: (faceShape) => set({ faceShape }),

  reset: () => set({ ...initial }),
}));
