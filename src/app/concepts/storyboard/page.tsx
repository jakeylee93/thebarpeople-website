import type { Metadata } from 'next';
import Storyboard from '@/components/film/Storyboard';

export const metadata: Metadata = {
  title: { absolute: 'Storyboard · Opening film · The Bar People (prototype)' },
};

export default function StoryboardPage() {
  return <Storyboard />;
}
