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

  return (
    <button 
      onClick={handleSignIn} 
      className='bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-blue-100 transition duration-300 flex items-center'
    >
      <svg 
        fill="#000000" 
        height="24px" 
        width="24px" 
        version="1.1" 
        id="Capa_1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 210 210" 
        xmlSpace="preserve"
        className="mr-2"
      >
        <g id="SVGRepo_iconCarrier">
          <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40 c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105 S0,162.897,0,105z"></path>
        </g>
      </svg>
      Sign in with Google
    </button>
  );
};

export default LoginButton;