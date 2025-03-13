
import React, { useState, useRef, useEffect } from 'react';
import { UnsplashImage } from '@/services/ImageService';

interface ImageCardProps {
  image: UnsplashImage;
  onClick: (image: UnsplashImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate how many rows this image should span based on its aspect ratio
  useEffect(() => {
    if (imageRef.current) {
      const aspectRatio = image.width / image.height;
      const rowSpan = Math.ceil(300 / (10 * aspectRatio) + 2); // 300px is the column width, 10px is the grid row height
      setRows(rowSpan);
    }
  }, [image.width, image.height]);

  const handleClick = () => {
    onClick(image);
  };

  return (
    <div 
      className="image-item cursor-pointer group"
      style={{ "--rows": rows } as React.CSSProperties}
      onClick={handleClick}
    >
      <div className="relative h-full w-full overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
        <img
          ref={imageRef}
          src={image.urls.regular}
          alt={image.alt_description || "Unsplash image"}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
          <div className="p-3 w-full bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 text-white opacity-0 group-hover:opacity-100">
            <p className="text-sm truncate">{image.alt_description}</p>
            <p className="text-xs mt-1">By {image.user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
