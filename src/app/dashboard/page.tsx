"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

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

  return (
    <div>
      <h1>Your Drawings</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {drawings.map((drawing) => (
          <div key={drawing.id} onClick={() => handleSelectDrawing(drawing.id)} style={{ cursor: 'pointer' }}>
            <Image src={drawing.data} alt="User drawing" width={200} height={200} />
            <p>Created: {new Date(drawing.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <button onClick={handleNewDrawing}>Add New Drawing</button>
    </div>
  );
};

export default Dashboard;