import { Fossil } from "../types/gameTypes";

export const fossilData: Fossil[] = [
  // Triceratops
  {
    id: "triceratops-skull",
    name: "Triceratops Skull",
    dinosaurSpecies: "Triceratops",
    category: "herbivore",
    rarity: "common",
    pieceType: "skull",
    completeness: 100,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A well-preserved Triceratops skull.",
    imageUrl: "https://npr.brightspotcdn.com/dims4/default/da25602/2147483647/strip/true/crop/3063x2209+0+0/resize/1760x1270!/format/webp/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fhppr%2Ffiles%2F201709%2FSmithsonian-Triceratops-skull-cast-0002a.jpg"
  },
  {
    id: "triceratops-rib",
    name: "Triceratops Rib",
    dinosaurSpecies: "Triceratops",
    category: "herbivore",
    rarity: "common",
    pieceType: "rib",
    completeness: 90,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A rib bone from a Triceratops.",
    imageUrl: "https://assets0.fossilera.com/sp/380434/dinosaur-bones/708x500%3E/triceratops-horridus.jpg"
  },
  {
    id: "triceratops-tail",
    name: "Triceratops Tail Vertebra",
    dinosaurSpecies: "Triceratops",
    category: "herbivore",
    rarity: "rare",
    pieceType: "tail",
    completeness: 80,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A rare tail vertebra from a Triceratops.",
    imageUrl: "https://media.cnn.com/api/v1/images/stellar/prod/131003033112-01-dinosaur-fossil-10003.jpg?q=x_0,y_432,h_2592,w_4608,c_crop/h_540,w_960"
  },
  // T-Rex
  {
    id: "trex-skull",
    name: "T-Rex Skull",
    dinosaurSpecies: "T-Rex",
    category: "carnivore",
    rarity: "rare",
    pieceType: "skull",
    completeness: 100,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A massive skull from a Tyrannosaurus Rex.",
    imageUrl: "https://media.cnn.com/api/v1/images/stellar/prod/221109115514-05-maximus-t-rex-skull-auction.jpg?q=w_1160,c_fill/f_webp"
  },
  {
    id: "trex-rib",
    name: "T-Rex Rib",
    dinosaurSpecies: "T-Rex",
    category: "carnivore",
    rarity: "common",
    pieceType: "rib",
    completeness: 85,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A rib bone from a T-Rex.",
    imageUrl: "https://www.datocms-assets.com/44232/1640823764-gastralia1e9a0025-edit.jpg?fm=webp"
  },
  {
    id: "trex-tail",
    name: "T-Rex Tail Vertebra",
    dinosaurSpecies: "T-Rex",
    category: "carnivore",
    rarity: "legendary",
    pieceType: "tail",
    completeness: 70,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A legendary tail vertebra from a T-Rex.",
    imageUrl: "https://thumbs.dreamstime.com/b/t-rex-dinosaur-tail-skeleton-bones-fossilized-tyrannosaurus-display-los-angeles-natural-history-museum-34440814.jpg"
  },
  // Stegosaurus
  {
    id: "stegosaurus-skull",
    name: "Stegosaurus Skull",
    dinosaurSpecies: "Stegosaurus",
    category: "herbivore",
    rarity: "rare",
    pieceType: "skull",
    completeness: 100,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A rare Stegosaurus skull.",
    imageUrl: "https://i0.wp.com/www.bhigr.com/wp-content/uploads/2021/06/sarahstego-skull_010.jpg?w=600&ssl=1"
  },
  {
    id: "stegosaurus-rib",
    name: "Stegosaurus Rib",
    dinosaurSpecies: "Stegosaurus",
    category: "herbivore",
    rarity: "common",
    pieceType: "rib",
    completeness: 90,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A rib bone from a Stegosaurus.",
    imageUrl: "https://scx1.b-cdn.net/csz/news/800a/2024/a-150-million-year-old.jpg"
  },
  {
    id: "stegosaurus-tail",
    name: "Stegosaurus Tail Spike",
    dinosaurSpecies: "Stegosaurus",
    category: "herbivore",
    rarity: "legendary",
    pieceType: "tail",
    completeness: 100,
    discoveryDate: new Date(),
    siteFound: "Default Site",
    description: "A legendary tail spike from a Stegosaurus.",
    imageUrl: "https://c02.purpledshub.com/uploads/sites/41/2021/08/GettyImages-459896614-bd6cd3d.jpg?webp=1&w=1200"
  },
];

export const dinosaurData = [
  {
    name: "Triceratops",
    requiredPieces: ["skull", "rib", "tail"],
    facts: [
      "Triceratops had three horns on its face and a large bony frill.",
      "It was a herbivore that lived during the late Cretaceous period.",
      "Triceratops could grow up to 30 feet long."
    ]
  },
  {
    name: "T-Rex",
    requiredPieces: ["skull", "rib", "tail"],
    facts: [
      "T-Rex was one of the largest land carnivores of all time.",
      "It had teeth up to 12 inches long.",
      "T-Rex lived about 68 to 66 million years ago."
    ]
  },
  {
    name: "Stegosaurus",
    requiredPieces: ["skull", "rib", "tail"],
    facts: [
      "Stegosaurus had large, bony plates along its back and a spiked tail.",
      "It was a slow-moving herbivore from the Jurassic period.",
      "Its brain was about the size of a walnut."
    ]
  }
]; 