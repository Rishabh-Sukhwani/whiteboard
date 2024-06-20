"use client";

import { signIn, signOut, useSession } from 'next-auth/react';

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
};

export default LoginButton;
