"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Tray from './tray';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState({ points: [], size: 5, color: '#df4b26', tool: 'draw' });
  const [strokes, setStrokes] = useState([]);
  const [strokeSize, setStrokeSize] = useState(5);
  const [strokeColor, setStrokeColor] = useState('#df4b26');
  const [tool, setTool] = useState('draw');
  const [loadedData, setLoadedData] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const drawingId = searchParams.get('id');

  useEffect(() => {
    if (drawingId) {
      fetchDrawing(drawingId);
    }
  }, [drawingId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';

      if (loadedData) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0);
          if (loadedData.strokes) {
            setStrokes(loadedData.strokes);
            loadedData.strokes.forEach(drawStroke);
          }
        };
        img.src = loadedData.data;
      } else {
        // Clear the canvas and set white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [loadedData]);

  const fetchDrawing = async (id) => {
    try {
      const response = await fetch(`/api/drawings/${id}`);
      if (response.ok) {
        const drawingData = await response.json();
        console.log("Fetched drawing data:", drawingData);
        setLoadedData(drawingData);
        setStrokes(drawingData.strokes || []);
      } else {
        console.error('Failed to fetch drawing');
      }
    } catch (error) {
      console.error('Error fetching drawing:', error);
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setCurrentStroke({ points: [{ x: offsetX, y: offsetY }], size: strokeSize, color: strokeColor, tool: tool });
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentStroke((prevStroke) => {
      const updatedStroke = {
        ...prevStroke,
        points: [...prevStroke.points, newPoint]
      };
      drawStroke(updatedStroke);
      return updatedStroke;
    });
  };

  const drawStroke = (stroke) => {
    const context = canvasRef.current.getContext('2d');
    const smoothedPoints = applyChaikinAlgorithm(stroke.points);
    if (smoothedPoints.length < 2) return;

    context.beginPath();
    context.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
    smoothedPoints.forEach((point) => {
      context.lineTo(point.x, point.y);
    });
    context.lineWidth = stroke.tool === 'draw' ? stroke.size : 20;
    context.strokeStyle = stroke.tool === 'draw' ? stroke.color : 'white';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokes((prevStrokes) => [...prevStrokes, currentStroke]);
      setCurrentStroke({ points: [], size: strokeSize, color: strokeColor, tool: tool });
    }
  };

  const redrawAllStrokes = () => {
    const context = canvasRef.current.getContext('2d');

    // Clear the canvas and redraw the background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Redraw the loaded image if it exists
    if (loadedData) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);

        // Draw all strokes
        strokes.forEach(drawStroke);
      };
      img.src = loadedData.data;
    } else {
      // If no loaded data, just draw all strokes
      strokes.forEach(drawStroke);
    }
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const method = drawingId ? 'PUT' : 'POST';
    const url = drawingId ? `/api/drawings/${drawingId}` : '/api/drawings';
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataUrl,
          strokes: strokes  // Include all strokes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Drawing saved:', data);
        router.push('/dashboard');
      } else {
        console.error('Failed to save drawing');
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };

  const applyChaikinAlgorithm = (points) => {
    let newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      let p0 = points[i];
      let p1 = points[i + 1];
      let Q = {
        x: 0.75 * p0.x + 0.25 * p1.x,
        y: 0.75 * p0.y + 0.25 * p1.y,
      };
      let R = {
        x: 0.25 * p0.x + 0.75 * p1.x,
        y: 0.25 * p0.y + 0.75 * p1.y,
      };
      newPoints.push(Q);
      newPoints.push(R);
    }
    return newPoints;
  };

  return (
    <div>
      <Tray
        onStrokeSizeChange={setStrokeSize}
        onColorChange={setStrokeColor}
        onToolChange={setTool}
      />
      <canvas
        ref={canvasRef}
        width={800}  // Set a fixed width
        height={600} // Set a fixed height
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        style={{ border: '1px solid black', backgroundColor: 'white' }}
      />
      <button onClick={handleSave}>{drawingId ? 'Update' : 'Save'}</button>
      {drawingId && <p>Editing drawing: {drawingId}</p>}
      {loadedData && <p>Drawing data loaded</p>}
    </div>
  );
};

export default Whiteboard;
