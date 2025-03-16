import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, Package, Coins, ChevronLeft, Tag, ShoppingBag
} from 'lucide-react';
import { getItemRarityColor } from '../data/gameData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const Shop: React.FC = () => {
  const { character, shopItems, buyItem, changeScreen } = useGame();

  if (!character) {
    return null;
  }

  return (
    <div className="game-section animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => changeScreen('world')}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>Back to World</span>
        </Button>
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-game-amber" />
          <span className="font-medium">{character.gold} Gold</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Store size={20} />
                Item Shop
              </CardTitle>
              <CardDescription>
                Browse and purchase items for your adventure
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => {
              const ItemIcon = item.icon;
              const rarityColor = getItemRarityColor(item.rarity);
              const canAfford = character.gold >= item.value;
              const isInStock = item.stock > 0;
              
              return (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`game-item border ${
                          !isInStock ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${rarityColor} bg-opacity-10`}>
                            <ItemIcon size={20} className={rarityColor} />
                          </div>
                          {item.discounted && (
                            <div className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Tag size={12} />
                              <span>Sale</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-1 font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Package size={14} />
                            <span>Stock: {item.stock}</span>
                          </div>
                          <div className={`text-xs ${rarityColor} bg-muted px-1.5 py-0.5 rounded capitalize`}>
                            {item.rarity}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center">
                            {item.discounted && item.originalValue ? (
                              <div className="flex flex-col">
                                <span className="text-xs line-through text-muted-foreground">
                                  {item.originalValue} gold
                                </span>
                                <span className="flex items-center text-green-500">
                                  <Coins size={14} className="mr-1" />
                                  {item.value} gold
                                </span>
                              </div>
                            ) : (
                              <span className="flex items-center text-muted-foreground">
                                <Coins size={14} className="mr-1" />
                                {item.value} gold
                              </span>
                            )}
                          </div>
                          
                          <Button
                            variant={canAfford && isInStock ? "default" : "outline"}
                            size="sm"
                            disabled={!canAfford || !isInStock}
                            onClick={() => buyItem(item.id)}
                          >
                            {!isInStock ? "Sold Out" : !canAfford ? "Too Expensive" : "Buy"}
                          </Button>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-60 p-0">
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <ItemIcon size={16} className={rarityColor} />
                          <div className="font-medium">{item.name}</div>
                          <div className={`ml-auto text-xs ${rarityColor} capitalize`}>
                            {item.rarity}
                          </div>
                        </div>
                        <div className="text-xs mb-2">{item.description}</div>
                        {item.stats && Object.entries(item.stats).length > 0 && (
                          <div className="space-y-1 text-xs">
                            {Object.entries(item.stats).map(([stat, value]) => (
                              <div key={stat} className="flex justify-between">
                                <span className="capitalize">{stat}</span>
                                <span className="text-green-500">+{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.effect && (
                          <div className="text-xs text-blue-500 mt-1">
                            Effect: {item.effect === 'heal' ? 'Restores health' : 'Restores mana'}
                          </div>
                        )}
                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span>{item.value} gold</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Available:</span>
                            <span>{item.stock} in stock</span>
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          
          <Separator className="my-6" />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Want to sell your items?</p>
            <Button 
              variant="outline" 
              onClick={() => changeScreen('inventory')}
              className="gap-2"
            >
              <ShoppingBag size={16} />
              Go to Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shop;