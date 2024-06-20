"use client";

import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const Protected = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Access Denied</p>;
  }

  return <p>Welcome to the protected page, {session.user?.name}</p>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Protected;
