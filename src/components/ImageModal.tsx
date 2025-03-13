
import React, { useEffect, useState } from 'react';
import { UnsplashImage } from '@/services/ImageService';
import { X, Download, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageModalProps {
  image: UnsplashImage | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (image) {
      setIsLoaded(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [image]);

  const handleDownload = () => {
    if (!image) return;
    
    toast({
      title: "Download started",
      description: "Your image will be downloaded shortly.",
    });
    
    // In a real app, this would trigger an actual download
    window.open(image.urls.full, '_blank');
  };

  const handleLike = () => {
    toast({
      title: "Image liked",
      description: "The image has been added to your favorites.",
    });
  };

  const handleShare = () => {
    if (navigator.share && image) {
      navigator.share({
        title: image.alt_description || 'Shared image from PixelOcean',
        text: `Check out this image by ${image.user.name} on PixelOcean`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      toast({
        title: "Link copied",
        description: "Image link copied to clipboard!",
      });
    }
  };

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-30 text-white hover:bg-black hover:bg-opacity-40 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        
        <div className="flex flex-col lg:flex-row h-full">
          <div className="relative flex-grow flex items-center justify-center bg-gray-100 h-[50vh] lg:h-[80vh] overflow-hidden">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={image.urls.regular} 
              alt={image.alt_description || "Unsplash image"}
              className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
          
          <div className="w-full lg:w-80 p-4 overflow-y-auto flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {image.alt_description || "Untitled image"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                By {image.user.name} (@{image.user.username})
              </p>
            </div>
            
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-600">
                {image.width} × {image.height}
              </p>
            </div>
            
            <div className="flex space-x-2 my-4">
              <Button variant="outline" size="sm" onClick={handleLike} className="flex-1">
                <Heart className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            
            <Button onClick={handleDownload} className="mt-4 w-full">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
