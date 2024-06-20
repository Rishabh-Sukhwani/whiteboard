//import Whiteboard from '../components/whiteboard';

/*
export default function Home() {
  return (
    <div>
      <Whiteboard />
    </div>
  );
}
*/

"use client";

import LoginButton from '../components/loginButton';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <h1>Welcome to the Whiteboard App</h1>
      <LoginButton />
      {status === 'authenticated' && <p>Welcome, {session.user?.name}</p>}
    </div>
  );
};

export default Home;
