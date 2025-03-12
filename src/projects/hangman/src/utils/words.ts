export const words = {
    animals: [
      "elephant", "giraffe", "zebra", "rhinoceros", "kangaroo", 
      "dolphin", "penguin", "octopus", "leopard", "buffalo",
      "squirrel", "gorilla", "flamingo", "hedgehog", "koala",
      "porcupine", "crocodile", "alligator", "jaguar", "raccoon"
    ],
    countries: [
      "australia", "brazil", "canada", "denmark", "egypt",
      "france", "germany", "hungary", "iceland", "japan",
      "kenya", "luxembourg", "malaysia", "norway", "portugal",
      "qatar", "singapore", "thailand", "ukraine", "vietnam"
    ],
    fruits: [
      "apple", "banana", "cherry", "dragonfruit", "elderberry",
      "fig", "grape", "honeydew", "kiwi", "lemon",
      "mango", "nectarine", "orange", "papaya", "quince",
      "raspberry", "strawberry", "tangerine", "watermelon", "blueberry"
    ],
    sports: [
      "basketball", "football", "tennis", "volleyball", "swimming",
      "cycling", "skiing", "baseball", "cricket", "hockey",
      "rugby", "archery", "badminton", "skateboarding", "surfing",
      "gymnastics", "karate", "wrestling", "sailing", "bowling"
    ],
    movies: [
      "titanic", "inception", "avatar", "gladiator", "frozen",
      "jaws", "alien", "casablanca", "psycho", "ghostbusters",
      "mulan", "zootopia", "braveheart", "blade", "rocky",
      "superman", "joker", "skyfall", "aladdin", "godzilla"
    ]
  };
  
  export type WordCategory = keyof typeof words;
  
  export const getRandomWord = (category: WordCategory): string => {
    const wordsInCategory = words[category];
    const randomIndex = Math.floor(Math.random() * wordsInCategory.length);
    return wordsInCategory[randomIndex];
  };
  
  export const getCategories = (): WordCategory[] => {
    return Object.keys(words) as WordCategory[];
  };