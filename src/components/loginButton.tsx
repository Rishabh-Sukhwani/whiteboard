"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </div>
    );
  }

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default LoginButton;