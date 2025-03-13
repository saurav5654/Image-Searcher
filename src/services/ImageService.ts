
// Real Unsplash API service implementation

interface UnsplashImage {
  id: string;
  alt_description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
  user: {
    name: string;
    username: string;
  };
}

// Predefined categories for the application
const CATEGORIES = [
  "Nature",
  "Travel",
  "Architecture",
  "Food",
  "Animals",
  "People",
  "Technology",
  "Business"
];

export const ImageService = {
  // Unsplash API key
  apiKey: 'uthtf80Fsjr_jE1xDTpj712qz_YAZ4DEaB5kaqshhaU',
  
  // Base URL for Unsplash API
  baseUrl: 'https://api.unsplash.com',
  
  getImages: async (query?: string, page = 1, perPage = 12): Promise<UnsplashImage[]> => {
    try {
      let endpoint = '';
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        client_id: ImageService.apiKey
      });
      
      if (query && query.trim() !== '') {
        // Search endpoint if query is provided
        endpoint = '/search/photos';
        params.append('query', query);
      } else {
        // Get random photos if no query
        endpoint = '/photos';
      }
      
      const response = await fetch(`${ImageService.baseUrl}${endpoint}?${params.toString()}`);
      
      if (!response.ok) {
        console.error('Unsplash API error:', response.status, response.statusText);
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process response data based on endpoint
      const images = query && query.trim() !== '' 
        ? data.results  // Search endpoint returns results in a nested object
        : data;         // Photos endpoint returns an array directly
      
      return images.map((image: any) => ({
        id: image.id,
        alt_description: image.alt_description || image.description || 'Unsplash image',
        urls: {
          raw: image.urls.raw,
          full: image.urls.full,
          regular: image.urls.regular,
          small: image.urls.small,
          thumb: image.urls.thumb
        },
        width: image.width,
        height: image.height,
        user: {
          name: image.user.name,
          username: image.user.username
        }
      }));
    } catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return [];
    }
  },
  
  getImage: async (id: string): Promise<UnsplashImage | null> => {
    try {
      const response = await fetch(`${ImageService.baseUrl}/photos/${id}?client_id=${ImageService.apiKey}`);
      
      if (!response.ok) {
        console.error('Unsplash API error:', response.status, response.statusText);
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        alt_description: data.alt_description || data.description || 'Unsplash image',
        urls: {
          raw: data.urls.raw,
          full: data.urls.full,
          regular: data.urls.regular,
          small: data.urls.small,
          thumb: data.urls.thumb
        },
        width: data.width,
        height: data.height,
        user: {
          name: data.user.name,
          username: data.user.username
        }
      };
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      return null;
    }
  },
  
  getCategories: async (): Promise<string[]> => {
    // Return predefined categories
    // In a real app, you might fetch trending topics from Unsplash
    return CATEGORIES;
  },
  
  getSearchSuggestions: async (query: string): Promise<string[]> => {
    if (!query) return [];
    
    try {
      // In the real Unsplash API, there's no direct endpoint for search suggestions
      // We could use a combination of popular searches and autocomplete from your own backend
      // For now, let's return predefined suggestions based on query
      
      const suggestions = [
        "nature landscape",
        "city skyline",
        "food photography",
        "portrait photography", 
        "travel destinations",
        "architecture buildings",
        "animals wildlife",
        "technology gadgets",
        "business workspace",
        "abstract art"
      ];
      
      return suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }
  }
};

export type { UnsplashImage };
