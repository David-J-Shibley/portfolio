export const words = {
  animals: [
    "elephant", "giraffe", "zebra", "rhinoceros", "kangaroo", 
    "dolphin", "penguin", "octopus", "leopard", "buffalo",
    "squirrel", "gorilla", "flamingo", "hedgehog", "koala",
    "porcupine", "crocodile", "alligator", "jaguar", "raccoon",
    "hippopotamus", "panther", "armadillo", "meerkat", "wombat",
    "tarantula", "chameleon", "mongoose", "peacock", "woodpecker"
  ],
  countries: [
    "australia", "brazil", "canada", "denmark", "egypt",
    "france", "germany", "hungary", "iceland", "japan",
    "kenya", "luxembourg", "malaysia", "norway", "portugal",
    "qatar", "singapore", "thailand", "ukraine", "vietnam",
    "argentina", "belgium", "chile", "finland", "greece",
    "indonesia", "jamaica", "south africa", "switzerland", "new zealand"
  ],
  fruits: [
    "apple", "banana", "cherry", "dragonfruit", "elderberry",
    "fig", "grape", "honeydew", "kiwi", "lemon",
    "mango", "nectarine", "orange", "papaya", "quince",
    "raspberry", "strawberry", "tangerine", "watermelon", "blueberry",
    "pomegranate", "coconut", "apricot", "persimmon", "mulberry",
    "blackberry", "cranberry", "lychee", "cantaloupe", "passionfruit"
  ],
  sports: [
    "basketball", "football", "tennis", "volleyball", "swimming",
    "cycling", "skiing", "baseball", "cricket", "hockey",
    "rugby", "archery", "badminton", "skateboarding", "surfing",
    "gymnastics", "karate", "wrestling", "sailing", "bowling",
    "fencing", "rowing", "handball", "snowboarding", "motocross",
    "polo", "table tennis", "weightlifting", "golf", "track"
  ],
  movies: [
    "titanic", "inception", "avatar", "gladiator", "frozen",
    "jaws", "alien", "casablanca", "psycho", "ghostbusters",
    "mulan", "zootopia", "braveheart", "blade", "rocky",
    "superman", "joker", "skyfall", "aladdin", "godzilla",
    "interstellar", "the matrix", "forrest gump", "the godfather", "jurassic park",
    "star wars", "the avengers", "black panther", "pulp fiction", "shawshank redemption"
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