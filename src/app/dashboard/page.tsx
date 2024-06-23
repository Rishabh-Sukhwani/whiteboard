"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/solid';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [drawings, setDrawings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchDrawings();
    }
  }, [session]);

  const fetchDrawings = async () => {
    try {
      const response = await fetch('/api/drawings');
      if (response.ok) {
        const data = await response.json();
        setDrawings(data);
      } else {
        console.error('Failed to fetch drawings');
      }
    } catch (error) {
      console.error('Error fetching drawings:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be authenticated to view this page.</div>;
  }

  const handleNewDrawing = () => {
    router.push("/whiteboard");
  };

  const handleSelectDrawing = (drawingId) => {
    router.push(`/whiteboard?id=${drawingId}`);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Drawings</h1>
        <button 
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drawings.map((drawing) => (
          <div 
            key={drawing.id} 
            onClick={() => handleSelectDrawing(drawing.id)} 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Image 
              src={drawing.data} 
              alt="User drawing" 
              width={200} 
              height={200} 
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="bg-gray-400 p-2 rounded-b flex justify-between items-center">
              <p>
                Created: {new Date(drawing.createdAt).toLocaleDateString()}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  
                }}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={handleNewDrawing}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Drawing
      </button>
    </div>
  );
};

export default Dashboard;