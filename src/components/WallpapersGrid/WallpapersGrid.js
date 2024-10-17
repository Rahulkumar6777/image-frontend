// src/components/WallpapersGrid/WallpapersGrid.js
import React from 'react';
import WallpaperCard from '../WallpaperCard/WallpaperCard';
import './WallpapersGrid.css';

function WallpapersGrid({ images }) {
  return (
    <div className="wallpapers-grid">
      {images.map((img) => (
        <WallpaperCard key={img._id} image={img} />
      ))}
    </div>
  );
}

export default WallpapersGrid;
