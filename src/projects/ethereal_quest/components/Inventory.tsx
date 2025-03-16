import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, Package, Shirt, Beaker, Gem, 
  ChevronLeft, Info, Coins
} from 'lucide-react';
import { ItemType, getItemRarityColor } from '../data/gameData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Inventory: React.FC = () => {
  const { character, useItem, sellItem, equipItem, unequipItem, changeScreen } = useGame();
  const [selectedTab, setSelectedTab] = useState<ItemType | 'all'>('all');

  if (!character) {
    return null;
  }

  const filteredItems = character.inventory.filter(
    (item) => selectedTab === 'all' || item.type === selectedTab
  );

  const getItemTypeIcon = (type: ItemType) => {
    switch (type) {
      case 'weapon':
        return <Package size={16} />;
      case 'armor':
        return <Shirt size={16} />;
      case 'potion':
        return <Beaker size={16} />;
      case 'accessory':
        return <Gem size={16} />;
      case 'material':
        return <Gem size={16} />;
      default:
        return <Package size={16} />;
    }
  };

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
                <ShoppingBag size={20} />
                Inventory
              </CardTitle>
              <CardDescription>
                {character.inventory.length} items in your bag
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={(value) => setSelectedTab(value as ItemType | 'all')}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="weapon">Weapons</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
              <TabsTrigger value="accessory">Accessories</TabsTrigger>
              <TabsTrigger value="potion">Potions</TabsTrigger>
              <TabsTrigger value="material">Materials</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <ShoppingBag className="mx-auto mb-2 opacity-20" size={40} />
                  <p>No items of this type in your inventory</p>
                </div>
              ) : (
                <div className="inventory-grid">
                  {filteredItems.map((item) => {
                    const isEquipped = 
                      character.equipment.weapon?.id === item.id ||
                      character.equipment.armor?.id === item.id ||
                      character.equipment.accessory?.id === item.id;
                    
                    const ItemIcon = item.icon;
                    const rarityColor = getItemRarityColor(item.rarity);
                    
                    return (
                      <TooltipProvider key={item.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`game-item border ${
                                isEquipped ? 'border-primary bg-primary/5' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${rarityColor} bg-opacity-10`}>
                                  <ItemIcon size={20} className={rarityColor} />
                                </div>
                                {isEquipped && (
                                  <div className="bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                                    Equipped
                                  </div>
                                )}
                              </div>
                              
                              <div className="mb-1 font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {item.description}
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                <div className="text-xs bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                                  {getItemTypeIcon(item.type)}
                                  <span className="capitalize">{item.type}</span>
                                </div>
                                <div className={`text-xs ${rarityColor} bg-muted px-1.5 py-0.5 rounded capitalize`}>
                                  {item.rarity}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center text-muted-foreground text-xs">
                                  <Coins size={14} className="mr-1" />
                                  {item.value} gold
                                </div>
                                
                                <div className="flex gap-1">
                                  {item.usable && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => useItem(item.id)}
                                    >
                                      Use
                                    </Button>
                                  )}
                                  
                                  {(item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') && (
                                    isEquipped ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const slot = item.type === 'weapon' 
                                            ? 'weapon' 
                                            : item.type === 'armor' 
                                              ? 'armor' 
                                              : 'accessory';
                                          unequipItem(slot);
                                        }}
                                      >
                                        Unequip
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => equipItem(item.id)}
                                      >
                                        Equip
                                      </Button>
                                    )
                                  )}
                                  
                                  {!isEquipped && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => sellItem(item.id)}
                                    >
                                      Sell
                                    </Button>
                                  )}
                                </div>
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
                              <div className="mt-2 pt-2 border-t border-gray-200 text-xs flex justify-between">
                                <span>Sell value:</span>
                                <span>{Math.floor(item.value / 2)} gold</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;