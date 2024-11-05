'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SkinItem {
  id: number;
  name: string;
  price: number;
  float: number;
  wear: string;
  weapon: string;
  weaponType: string;
  image: string;
  inspectLink: string;
  isStatTrak: boolean;
  hasStickers: boolean;
  hasLowFloat: boolean;
}

export function BdmSkinsShop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "float-asc" | "float-desc">("price-asc");
  const [skinItems, setSkinItems] = useState<SkinItem[]>([]);

  // Função para buscar os dados de `skinItem` da API
  const fetchSkinItems = async () => {
    try {
      const response = await fetch('/api/skinitem');
      if (!response.ok) {
        console.error(`Erro na resposta da API: ${response.status}`);
        return;
      }
      const data = await response.json();

      // Mapeia os dados para o formato que o frontend espera
      const mappedData = data.map((item: { id: number;
         skinWeapon: { skin: { name: string };
          weapon: { name: string; weaponType: { name: string } } };
           price: number;
            float: number;
             wear: { name: string };
              imgLink: string; inspectLink: string;
               isStatTrak: boolean;
                hasStickers: boolean;
                 hasLowFloat: boolean; }) => ({
        id: item.id,
        name: item.skinWeapon.skin.name,
        price: item.price,
        float: item.float,
        wear: item.wear.name,
        weapon: item.skinWeapon.weapon.name,
        weaponType: item.skinWeapon.weapon.weaponType.name,
        image: item.imgLink,
        inspectLink: item.inspectLink,
        isStatTrak: item.isStatTrak,
        hasStickers: item.hasStickers,
        hasLowFloat: item.hasLowFloat,
      }));
      
      setSkinItems(mappedData);
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error);
    }
  };

  useEffect(() => {
    fetchSkinItems();
  }, []);

  // Filtra e ordena os itens de `skinItem` com base na pesquisa e na opção de ordenação
  const filteredSkins = skinItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.weapon.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "price-asc") {
        return a.price - b.price;
      } else if (sortOption === "price-desc") {
        return b.price - a.price;
      } else if (sortOption === "float-asc") {
        return a.float - b.float;
      } else {
        return b.float - a.float;
      }
    });

  // Função para redirecionar para o WhatsApp com o nome da skin
  const handleBuyNowClick = (skinName: string) => {
    const message = `Olá, estou interessado na skin: ${encodeURIComponent(skinName)}`;
    const whatsappLink = `https://wa.me/5551994025473?text=${message}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-6">
        <header className="text-center mb-10 pt-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            BDM Skins
          </h1>
          <p className="text-gray-400">Premium CS2 Skins Marketplace</p>
        </header>

        {/* Search and Sort Section */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search skins..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "price-asc" | "price-desc" | "float-asc" | "float-desc")}
              className="bg-gray-800 border-gray-700 text-white p-2 rounded-md"
            >
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="float-asc">Menor Float</option>
              <option value="float-desc">Maior Float</option>
            </select>
          </div>
        </div>
        
        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkins.map((item) => (
            <Card 
              key={item.id} 
              className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <CardHeader className="p-4">
                <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-3/4 h-3/4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-300"
                  />
                  {item.hasLowFloat && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Good Float
                  </div>
                )}
                {/* Adesivo para stickers */}
                {item.hasStickers && (
                  <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                    Stickers
                  </div>
                )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                <CardTitle className="text-md mb-2 text-gray-100">
                  {item.weapon} {item.isStatTrak ? "(StatTrak™)" : ""} | {item.name}
                </CardTitle>
                <div className="flex flex-col space-y-2 flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-blue-400">R${item.price.toFixed(2)}</p>
                      <p className="text-xl font-bold text-red-500 line-through">R${(item.price * 1.35).toFixed(2)}</p>
                    </div>
                    
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">{item.wear}</span>
                    <span className="text-sm text-gray-400">Float: {item.float.toFixed(8)}</span>
                  </div>
                  <Button
                    onClick={() => handleBuyNowClick(`${item.weapon} | ${item.name}`)}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600"
                  >
                    Buy Now
                  </Button>
                  <Button
                    onClick={() => window.open(item.inspectLink, "_blank")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Inspect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
