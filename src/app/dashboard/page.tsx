"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // Correct hook for App Router

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [drawings, setDrawings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // Fetch drawings for the authenticated user
      // This is a placeholder; replace with your actual fetch logic
      setDrawings([
        { id: 1, drawing: "/path/to/drawing1.png" },
        { id: 2, drawing: "/path/to/drawing2.png" },
      ]);
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be authenticated to view this page.</div>;
  }

  const handleNewDrawing = () => {
    router.push("/whiteboard");
  };

  return (
    <div>
      <h1>Your Drawings</h1>
      <div>
        {drawings.map((drawing) => (
          <img key={drawing.id} src={drawing.drawing} alt="User drawing" />
        ))}
      </div>
      <button onClick={handleNewDrawing}>Add New Drawing</button>
    </div>
  );
};

export default Dashboard;
