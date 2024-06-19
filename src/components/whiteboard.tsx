"use client";

import React, { useRef, useEffect, useState } from 'react';
import Tray from './tray';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState({ points: [], size: 5, color: '#df4b26', tool: 'draw' });
  const [strokes, setStrokes] = useState([]);
  const [strokeSize, setStrokeSize] = useState(5);
  const [strokeColor, setStrokeColor] = useState('#df4b26');
  const [tool, setTool] = useState('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Clear the canvas with a white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setCurrentStroke({ points: [{ x: offsetX, y: offsetY }], size: strokeSize, color: strokeColor, tool: tool });
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentStroke((prevStroke) => ({
      ...prevStroke,
      points: [...prevStroke.points, newPoint]
    }));

    redrawAllStrokes([...strokes, { ...currentStroke, points: [...currentStroke.points, newPoint] }]);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setStrokes((prevStrokes) => [...prevStrokes, currentStroke]);
    setCurrentStroke({ points: [], size: strokeSize, color: strokeColor, tool: tool });
  };

  const redrawAllStrokes = (allStrokes) => {
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    allStrokes.forEach((stroke) => {
      const smoothedPoints = applyChaikinAlgorithm(stroke.points);
      if (smoothedPoints.length < 2) return;

      context.beginPath();
      context.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
      smoothedPoints.forEach((point) => {
        context.lineTo(point.x, point.y);
      });

      context.lineWidth = stroke.tool === 'draw' ? stroke.size : 20;
      context.strokeStyle = stroke.tool === 'draw' ? stroke.color : 'white';
      context.stroke();
    });
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: dataUrl }),
    });
    const data = await response.json();
    console.log(data);
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
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        style={{ border: '1px solid black', backgroundColor: 'white' }}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Whiteboard;
