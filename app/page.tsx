import { auth } from '@clerk/nextjs/server';
import Hero from './components/Hero';
import Features from './components/Features';

export default function Home() {
  const { userId } = auth();

  return (
    <>
      <Hero userId={userId} />
      <Features />
    </>
  );
}