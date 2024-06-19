"use client";

import React from 'react';

const Tray = ({ onStrokeSizeChange, onColorChange, onToolChange }) => {
  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded shadow flex items-center space-x-3">
      <label className="flex items-center space-x-2">
        <span>Stroke Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          defaultValue="5"
          onChange={(e) => onStrokeSizeChange(e.target.value)}
          className="ml-2"
        />
      </label>
      <label className="flex items-center space-x-2">
        <span>Color:</span>
        <input
          type="color"
          defaultValue="#df4b26"
          onChange={(e) => onColorChange(e.target.value)}
          className="ml-2"
        />
      </label>
      <button
        onClick={() => onToolChange('draw')}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Draw
      </button>
      <button
        onClick={() => onToolChange('erase')}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Erase
      </button>
    </div>
  );
};

export default Tray;
