import HeroAscii from '../components/ui/hero-ascii';

interface HomeProps {
  onDemo?: () => void;
}

export default function Home({ onDemo }: HomeProps) {
  return <HeroAscii onDemo={onDemo} />;
}
