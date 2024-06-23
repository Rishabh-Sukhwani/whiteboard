"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginButton from '../components/loginButton';

const Home = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div>
      <h1>Welcome to the Whiteboard App</h1>
      <LoginButton />
    </div>
  );
};

export default Home;