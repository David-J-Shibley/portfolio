import { GameState, PropertyColor } from "../types/game";

// AI Strategy utility functions
export const aiDecisions = {
  // Determine if the AI should buy a property
  shouldBuyProperty: (gameState: GameState, propertyId: number): boolean => {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId)!;
    const property = gameState.properties.find(p => p.id === propertyId)!;
    
    // Basic financial check - don't spend below a certain threshold
    const minSafeMoney = 200;
    if (player.money - property.price < minSafeMoney) {
      return false;
    }
    
    // Calculate property value based on several factors
    let propertyValue = 0;
    
    // Base value
    propertyValue += property.price;
    
    // Check if AI already owns properties of the same color
    const sameColorProperties = gameState.properties.filter(
      p => p.color === property.color && p.owner === player.id
    );
    
    if (sameColorProperties.length > 0) {
      // More valuable if AI already has properties of this color
      propertyValue *= 1.5;
    }
    
    // Check if this would complete a monopoly
    const colorGroup = gameState.properties.filter(p => p.color === property.color);
    const ownedInGroup = sameColorProperties.length;
    
    if (ownedInGroup + 1 === colorGroup.length) {
      // Much more valuable if it completes a monopoly
      propertyValue *= 2;
    }
    
    // Railroads increase in value the more you have
    if (property.color === 'railroad') {
      const railroadsOwned = gameState.properties.filter(
        p => p.color === 'railroad' && p.owner === player.id
      ).length;
      
      // Each railroad becomes more valuable
      propertyValue *= (1 + railroadsOwned * 0.5);
    }
    
    // Utilities are more valuable if you have both
    if (property.color === 'utility') {
      const utilitiesOwned = gameState.properties.filter(
        p => p.color === 'utility' && p.owner === player.id
      ).length;
      
      if (utilitiesOwned === 1) {
        propertyValue *= 1.8;
      }
    }
    
    // Early game properties are more valuable (lower position means earlier in the game)
    if (property.position < 20) {
      propertyValue *= 1.2;
    }
    
    // Compare calculated value to price
    return propertyValue > property.price * 0.8;
  },
  
  // Determine if the AI should mortgage a property
  shouldMortgageProperty: (gameState: GameState, propertyId: number): boolean => {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId)!;
    
    // Only mortgage if money is low
    if (player.money > 100) {
      return false;
    }
    
    const property = gameState.properties.find(p => p.id === propertyId)!;
    
    // Don't mortgage if it's part of a monopoly
    const sameColorProperties = gameState.properties.filter(
      p => p.color === property.color && p.owner === player.id
    );
    
    const colorGroup = gameState.properties.filter(p => p.color === property.color);
    
    if (sameColorProperties.length === colorGroup.length) {
      return false; // Don't mortgage monopolies
    }
    
    // Check if there are houses on the property
    if (property.houses > 0) {
      return false;
    }
    
    // Mortgage utilities and railroads last
    if (property.color === 'utility' || property.color === 'railroad') {
      return false;
    }
    
    return true;
  },
  
  // Determine if the AI should build houses
  shouldBuildHouse: (gameState: GameState, propertyId: number): boolean => {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId)!;
    const property = gameState.properties.find(p => p.id === propertyId)!;
    
    // Check if player has a monopoly on this color
    const colorProperties = gameState.properties.filter(
      p => p.color === property.color
    );
    
    const ownedInColor = colorProperties.filter(
      p => p.owner === player.id
    );
    
    // Must own all properties of this color
    if (ownedInColor.length !== colorProperties.length) {
      return false;
    }
    
    // Check if player can afford to build
    if (player.money < property.houseCost * 1.5) {
      return false;
    }
    
    // Don't build beyond 5 houses (hotel)
    if (property.houses >= 5) {
      return false;
    }
    
    // Build evenly - ensure no property in the group has more than 1 more house
    const minHousesInGroup = Math.min(...ownedInColor.map(p => p.houses));
    if (property.houses > minHousesInGroup) {
      return false;
    }
    
    // More aggressive building on higher value properties
    const isHighValue = ['red', 'yellow', 'green', 'darkBlue'].includes(property.color as PropertyColor);
    
    // Probability of building based on property value
    const buildProbability = isHighValue ? 0.8 : 0.5;
    
    return Math.random() < buildProbability;
  },
  
  // Decide which property to mortgage when in financial trouble
  chooseMortgageProperty: (gameState: GameState): number | null => {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId)!;
    const ownedProperties = gameState.properties.filter(
      p => p.owner === player.id && p.status === 'owned' && p.houses === 0
    );
    
    if (ownedProperties.length === 0) {
      return null;
    }
    
    // Sort by mortgage value (lowest first)
    ownedProperties.sort((a, b) => a.mortgageValue - b.mortgageValue);
    
    // Prioritize non-monopoly properties
    for (const property of ownedProperties) {
      const sameColorProperties = gameState.properties.filter(
        p => p.color === property.color
      );
      
      const ownedInColor = sameColorProperties.filter(
        p => p.owner === player.id
      );
      
      // If this isn't part of a monopoly, mortgage it first
      if (ownedInColor.length !== sameColorProperties.length) {
        return property.id;
      }
    }
    
    // If all properties are part of monopolies, just take the lowest value one
    return ownedProperties[0].id;
  },
  
  // Choose which property to build houses on
  chooseBuildHouseProperty: (gameState: GameState): number | null => {
    const player = gameState.players.find(p => p.id === gameState.currentPlayerId)!;
    
    // Get all color groups where the player has a monopoly
    const ownedColors = new Set<PropertyColor>();
    
    gameState.properties.forEach(property => {
      if (property.owner === player.id && property.color !== 'railroad' && property.color !== 'utility') {
        const sameColorProperties = gameState.properties.filter(
          p => p.color === property.color
        );
        
        const ownedInColor = sameColorProperties.filter(
          p => p.owner === player.id
        );
        
        if (ownedInColor.length === sameColorProperties.length) {
          ownedColors.add(property.color);
        }
      }
    });
    
    if (ownedColors.size === 0) {
      return null;
    }
    
    // Prioritize high-value properties
    const priorityColors: PropertyColor[] = ['darkBlue', 'green', 'yellow', 'red', 'orange', 'pink', 'lightBlue', 'brown'];
    
    for (const color of priorityColors) {
      if (ownedColors.has(color)) {
        // Get properties of this color
        const colorProperties = gameState.properties.filter(
          p => p.color === color && p.owner === player.id
        );
        
        // Find property with fewest houses
        colorProperties.sort((a, b) => a.houses - b.houses);
        
        // Check if player can afford to build on this property
        if (player.money >= colorProperties[0].houseCost * 1.5 && colorProperties[0].houses < 5) {
          return colorProperties[0].id;
        }
      }
    }
    
    return null;
  }
};