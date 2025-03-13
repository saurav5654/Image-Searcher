
import React, { useEffect, useState } from 'react';
import { ImageService } from '@/services/ImageService';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoriesProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await ImageService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="my-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 py-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onCategorySelect('')}
          >
            All
          </Button>
          
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-9 w-24 rounded-full bg-gray-200 animate-pulse"></div>
            ))
          ) : (
            categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </Button>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Categories;
