'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

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
  tradeLockStartDate?: string;
  tradeLockDurationDays?: number;
}

export function BdmSkinsShop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "float-asc" | "float-desc">("price-asc");
  const [skinItems, setSkinItems] = useState<SkinItem[]>([]);
  const [weaponTypeFilter, setWeaponTypeFilter] = useState<string>("all");
  const [isDarkMode, setIsDarkMode] = useState(false);



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
          hasLowFloat: boolean;
          tradeLockStartDate: Date;}) => ({
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
        tradeLockStartDate: item.tradeLockStartDate || null,
      }));
      
      setSkinItems(mappedData);
    } catch (error) {
      console.error("Erro ao buscar os dados da API:", error);
    }
  };

  useEffect(() => {
    fetchSkinItems();
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Função para alternar entre os temas claro e escuro
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Filtra e ordena os itens de `skinItem` com base na pesquisa e na opção de ordenação
  const filteredSkins = skinItems
  .filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.weapon.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWeaponType =
      weaponTypeFilter === "all" || item.weaponType === weaponTypeFilter;

    // Se estiver ordenando por float, remove agentes
    if (sortOption.includes("float")) {
      return matchesSearch && item.weaponType !== "Agent" && matchesWeaponType;
    }

    return matchesSearch && matchesWeaponType;
  })
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

    function calculateDaysRemaining(tradeLockStartDate: string): number {
      const now = new Date();
      const startDate = new Date(tradeLockStartDate);
      const endDate = new Date(startDate);
    
      // Adiciona os 8 dias (7 de trade lock + 1 adicional)
      endDate.setDate(startDate.getDate() + 8);
    
      // Ajusta o horário para 5:00 da manhã no horário de Brasília (GMT-3)
      endDate.setHours(5, 0, 0, 0);
    
      // Converte o horário atual para o mesmo fuso horário (GMT-3)
      const nowInGMT3 = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );
    
      // Calcula a diferença de tempo
      const diffTime = endDate.getTime() - nowInGMT3.getTime();
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
      return Math.max(0, remainingDays); // Garante que nunca seja negativo
    }
    
  // Função para redirecionar para o WhatsApp com o nome da skin
  const handleBuyNowClick = (skinName: string) => {
    const message = `Olá, estou interessado na skin: ${encodeURIComponent(skinName)}`;
    const whatsappLink = `https://wa.me/5551994025473?text=${message}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-tr from-blue-500 to-blue-800 dark:from-black dark:to-gray-900 text-white">
      <Button
        onClick={toggleTheme}
        className="fixed top-4 right-4 px-2 py-2 bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-300 rounded-full hover:bg-blue-400 dark:hover:bg-gray-500 transition duration-300"
      >
        {!isDarkMode ? "💡 Claro" : "🌙 Escuro"}
      </Button>
      <div className="container mx-auto p-6">
      <header className="text-center mb-2">
        <div className="flex justify-center items-center h-48 md:h-60">
          <div className="relative w-72 md:w-[28rem] h-full scale-150 pointer-events-none">
            <Image
              src="/logo.png"
              alt="BDM Skins Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <meta name="keywords" content="bdmskins, bdm skins, skins cs2, skins csgo, comprar skins cs2, marketplace skins cs2" />
      </header>



        {/* Search and Sort Section */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {/* Campo de Busca */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Procurar skins..."
                className="pl-10 bg-blue-500 border-blue-800 dark:bg-black dark:border-gray-900 text-white w-full placeholder:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Ordenação */}
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "price-asc" | "price-desc" | "float-asc" | "float-desc")
              }
              className="bg-blue-500 border-blue-800 dark:bg-black dark:border-gray-800 text-white p-2 rounded-md w-full sm:w-auto"
            >
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="float-asc">Menor Float</option>
              <option value="float-desc">Maior Float</option>
            </select>

            {/* Filtro de Armas */}
            <select
              value={weaponTypeFilter}
              onChange={(e) => setWeaponTypeFilter(e.target.value)}
              className="bg-blue-500 border-blue-800 dark:bg-black dark:border-gray-800 text-white p-2 rounded-md w-full sm:w-auto"
            >
              <option value="all">Todas as Armas</option>
              <option value="Knife">Facas</option>
              <option value="Glove">Luvas</option>
              <option value="Agent">Agentes</option>
              <option value="Rifle">Rifles</option>
              <option value="Pistol">Pistolas</option>
              <option value="Smg">SMGs</option>
              <option value="Shotgun">Shotguns</option>
              <option value="Machinegun">Metralhadoras</option>
            </select>
          </div>
        </div>
        {/* Skins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkins.map((item) => (
            
            <Card 
              key={item.id} 
              className="bg-blue-800 border-blue-700 dark:bg-black dark:border-gray-900 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <CardHeader className="p-4">
                <div className="relative aspect-square bg-blue-600 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={256}
                    height={256}
                    unoptimized
                    objectFit="contain"
                    className="transition-transform duration-300 hover:scale-105 filter saturate-225"
                  />
                  {item.hasLowFloat && (
                  <div className="absolute top-2 left-2 bg-blue-500 dark:bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    Bom Float
                  </div>
                )}
                {/* Adesivo para stickers */}
                {item.hasStickers && (
                  <div className="absolute top-2 right-2 bg-yellow-600 dark:bg-yellow-700 text-white text-xs px-2 py-1 rounded-full">
                    Stickers
                  </div>
                )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col flex-grow">
                <CardTitle className="text-md mb-2 text-gray-100 dark:text-gray-300">
                  {item.weapon} {item.isStatTrak ? "(StatTrak™)" : ""} | {item.name}
                </CardTitle>
                <div className="flex flex-col space-y-2 flex-grow">
                  <div className="flex justify-between items-center">
                  </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-blue-400 dark:text-blue-500">R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price)}</p>
                      <p className="text-xl font-bold text-red-500 line-through">R${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price * 1.35)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                  <div className={`text-sm ${item.tradeLockStartDate && calculateDaysRemaining(item.tradeLockStartDate) > 0 ? "text-red-500" : "text-green-500"}`}>
                    {item.tradeLockStartDate && calculateDaysRemaining(item.tradeLockStartDate) > 0
                      ? `Trade Lock: ${calculateDaysRemaining(item.tradeLockStartDate)} ${calculateDaysRemaining(item.tradeLockStartDate) === 1 ? "dia" : "dias"}`
                      : "Sem Trade Lock"}
                  </div>
                  <div className="flex justify-between items-center">
                    {item.weaponType === "Agent" ? (
                      <span className="px-2 py-1 bg-gray-400 text-white dark:text-gray-200 dark:bg-gray-500  rounded-full text-xs">Agent</span>
                    ) : (
                      <>
                        <span className="px-2 py-1 bg-gray-400 text-white dark:text-gray-200 dark:bg-gray-500  rounded-full text-xs">{item.wear}</span>
                        <span className="text-sm text-white dark:text-gray-300 ">Float: {item.float.toFixed(8)}</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => handleBuyNowClick(`${item.weapon} | ${item.name}`)}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 dark:text-gray-800 font-size text-base"
                  >
                    Compre Agora
                  </Button>
                  <Button
                    onClick={() => window.open(item.inspectLink, "_blank")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 dark:text-gray-700 text-base"
                  >
                    Inspecionar
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
