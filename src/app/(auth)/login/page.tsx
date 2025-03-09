"use client"

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginPage() {
  const { data: session } = useSession();
  return (
    <div className="w-full h-[calc(100vh-60px)] z-50 flex flex-col items-center justify-center text-black">
      <h1 className="text-xl">Connexion</h1>
      <div>
        {session ? (
          <>
            <p>Welcome {session.user?.name}</p>
            <button onClick={() => signOut()} className="bg-red-500 p-2">Logout</button>
          </>
        ) : (
          <button onClick={() => signIn('google')} className="bg-blue-500 p-2">Login with Google</button>
        )}
      </div>
    </div>
  );
}