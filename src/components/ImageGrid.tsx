
import React, { useEffect, useState } from 'react';
import ImageCard from './ImageCard';
import { ImageService, UnsplashImage } from '@/services/ImageService';
import { useToast } from '@/components/ui/use-toast';

interface ImageGridProps {
  searchQuery: string;
  onImageSelect: (image: UnsplashImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ searchQuery, onImageSelect }) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchImages = async (reset = false) => {
    try {
      setLoading(true);
      const newPage = reset ? 1 : page;
      const newImages = await ImageService.getImages(searchQuery, newPage);
      
      if (reset) {
        setImages(newImages);
        setPage(2);
      } else {
        setImages(prev => [...prev, ...newImages]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newImages.length > 0);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Infinite scroll implementation
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="w-full">
      <div className="image-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onClick={onImageSelect} />
        ))}
      </div>
      
      {loading && (
        <div className="w-full flex justify-center my-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      {!loading && !hasMore && images.length > 0 && (
        <div className="w-full text-center my-8 text-gray-500">
          No more images to load
        </div>
      )}
      
      {!loading && images.length === 0 && (
        <div className="w-full text-center my-16">
          <p className="text-lg text-gray-500">No images found</p>
          <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
