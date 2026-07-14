import { useEffect } from 'react';
import { useApp } from './store';
import { initTelegram } from './telegram';
import { track } from './logic/analytics';
import { WelcomeScreen, QuizScreen } from './screens/StepScreens';
import { ArchetypeResultScreen } from './screens/ArchetypeScreens';
import {
  BodyScreen,
  FaceTypeScreen,
  FaceShapeScreen,
  AnalyzingScreen,
} from './screens/AppearanceScreens';
import { ResultScreen } from './screens/ResultScreen';

export default function App() {
  const screen = useApp((s) => s.screen);

  useEffect(() => {
    initTelegram();
    track('app_open');
  }, []);

  switch (screen) {
    case 'welcome':
      return <WelcomeScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'archetype-result':
      return <ArchetypeResultScreen />;
    case 'body':
      return <BodyScreen />;
    case 'face-type':
      return <FaceTypeScreen />;
    case 'face-shape':
      return <FaceShapeScreen />;
    case 'analyzing':
      return <AnalyzingScreen />;
    case 'result':
      return <ResultScreen />;
  }
}
