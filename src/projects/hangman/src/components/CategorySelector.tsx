import React from 'react';
import { Check } from 'lucide-react';
import { WordCategory, getCategories } from '../utils/words';

interface CategorySelectorProps {
  onSelect: (category: WordCategory) => void;
  selectedCategory: WordCategory;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, selectedCategory }) => {
  const categories = getCategories();
  
  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-center text-hangman-primary mb-2">
        Select a Category
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              py-2 px-3 
              rounded-lg 
              capitalize
              transition-all duration-200
              flex items-center justify-center
              ${selectedCategory === category 
                ? 'bg-hangman-primary text-white shadow-md' 
                : 'bg-white text-hangman-primary border border-hangman-primary/20 hover:bg-hangman-primary/10'}
            `}
          >
            {selectedCategory === category && <Check className="w-4 h-4 mr-1" />}
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
