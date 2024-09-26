import { auth } from '@clerk/nextjs/server';
import Hero from './components/Hero';

export default function Home() {
  const { userId } = auth();

  return (
    <>
      <Hero userId={userId} />
    </>
  );
}