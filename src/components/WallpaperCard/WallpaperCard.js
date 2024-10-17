// src/components/WallpaperCard/WallpaperCard.js
import React from 'react';
import './WallpaperCard.css';

function WallpaperCard({ image }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = image.title || 'wallpaper';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="wallpaper" data-category={image.category}>
      <a href={image.imageUrl} target="_blank" rel="noopener noreferrer">
        <img src={image.imageUrl} alt={image.title || 'Wallpaper'} />
      </a>
      <button
        className="download-button"
        onClick={handleDownload}
        aria-label={`Download ${image.title || 'Wallpaper'}`}
      >
        <i className="fas fa-download"></i> Download
      </button>
    </div>
  );
}

export default WallpaperCard;
