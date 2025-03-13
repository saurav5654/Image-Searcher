
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ImageGrid from '@/components/ImageGrid';
import ImageModal from '@/components/ImageModal';
import Categories from '@/components/Categories';
import { UnsplashImage } from '@/services/ImageService';
import { Image } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(category);
  };

  const handleImageSelect = (image: UnsplashImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">PixelOcean</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Discover stunning free images
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search through our collection of high-quality, royalty-free stock photos, perfect for any project.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />
          
          <Categories 
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
          
          <ImageGrid 
            searchQuery={searchQuery} 
            onImageSelect={handleImageSelect}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>PixelOcean - Find beautiful, free images for your projects.</p>
          <p className="mt-2">Images sourced from Unsplash. All images are free to use under the Unsplash license.</p>
        </div>
      </footer>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Index;
