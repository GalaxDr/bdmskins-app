'use client';

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Skin {
  id: number;
  name: string;
  weaponId: number;
}

interface Wear {
  id: number;
  name: string;
}

interface Weapon {
  id: number;
  name: string;
  weaponType: {
    id: number;
    name: string;
  };
}

interface SkinItem {
  id: number;
  price: number;
  float: number;
  wearId: number;
  imgLink: string;
  inspectLink: string;
  isStatTrak: boolean;
  hasStickers: boolean;
  hasLowFloat: boolean;
  skinWeaponId: number;
  tradeLockStartDate?: string;
  skinWeapon: {
    skin: Skin;
    weapon: Weapon;
  };
  wear: Wear;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>([]);
  const setWears = useState<Wear[]>([])[1];
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [skinItems, setSkinItems] = useState<SkinItem[]>([]);

  const [newSkinItem, setNewSkinItem] = useState({
    id: null as number | null,
    skinWeaponId: null as number | null,
    skinId: null as number | null,
    weaponId: null as number | null,
    price: "",
    float: "",
    wearId: null as number | null,
    imgLink: "",
    inspectLink: "",
    isStatTrak: false,
    hasStickers: false,
    hasLowFloat: false,
    tradeLockStartDate: "", 
  });

  function getWearIdFromFloat(floatValue: number): number {
    if (floatValue >= 0.0 && floatValue <= 0.07) return 1;
    if (floatValue > 0.07 && floatValue <= 0.15) return 2;
    if (floatValue > 0.15 && floatValue <= 0.38) return 3;
    if (floatValue > 0.38 && floatValue <= 0.45) return 4;
    if (floatValue > 0.45 && floatValue <= 1.0) return 5;
    throw new Error("Invalid float value for wear");
  }

  function handleFloatChange(float: string) {
    const floatValue = parseFloat(float);
    if (isNaN(floatValue)) return;
    const wearId = getWearIdFromFloat(floatValue);
    setNewSkinItem((prev) => ({
      ...prev,
      float: float,
      wearId: wearId,
    }));
  }

  const [editing, setEditing] = useState(false);
  
  const fetchWears = useCallback(async () => {
    const response = await fetch('/api/wears');
    const data = await response.json();
    setWears(data);
  }, [setWears]);
  
  const fetchSkinItems = useCallback(async () => {
    const response = await fetch('/api/skinitem');
    const data = await response.json();
    setSkinItems(data);
  }, [setSkinItems]);

  const fetchWeapons = useCallback(async () => {
    const response = await fetch('/api/weapons');
    const data = await response.json();
    data.sort((a: Weapon, b: Weapon) => a.name.localeCompare(b.name));
    setWeapons(data);
  }, [setWeapons]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSkinItems();
      fetchWears();
      fetchWeapons();
    }
  }, [isAuthenticated, fetchSkinItems, fetchWeapons, fetchWears]);

  const handleLogin = () => {
    if (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      console.log(process.env.USERNAME, process.env.PASSWORD);
      alert('Credenciais inválidas');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkinItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSkinItem((prev) => ({ ...prev, [name]: parseInt(value) || null }));
  };

  const handleWeaponChange = async (weaponId: number) => {
    setNewSkinItem((prev) => ({ ...prev, weaponId }));
    
    try {
      const response = await fetch(`/api/skinsByWeaponId?weaponId=${weaponId}`);
      let data: Skin[] = await response.json();
      data = data.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredSkins(data);
    } catch (error) {
      console.error("Failed to fetch skins for weapon:", error);
    }
  };

  const fetchOrCreateSkinWeaponId = async (skinId: number, weaponId: number) => {
    try {
      const response = await fetch(`/api/skinweapon?skinId=${skinId}&weaponId=${weaponId}`);
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Erro ao buscar ou criar skinWeaponId:", error);
      return null;
    }
  };
  

  const addOrUpdateSkinItem = async () => {
    const { id, skinId, weaponId, price, float, wearId, imgLink, inspectLink, isStatTrak, hasStickers, hasLowFloat, tradeLockStartDate} = newSkinItem;
  
    if (!skinId || !weaponId || !price.trim() || !float.trim() || !imgLink.trim() || !inspectLink.trim()
      || wearId === null || isStatTrak === null || hasStickers === null || hasLowFloat === null || tradeLockStartDate === "") {
      alert("Preencha todos os campos antes de adicionar o produto.");
      return;
    }

    const skinWeaponId = await fetchOrCreateSkinWeaponId(skinId, weaponId);
    const endpoint = id ? `/api/skinitem/${id}` : '/api/skinitem';
    const method = id ? 'PUT' : 'POST';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_TOKEN}`, 
      },
      body: JSON.stringify({
        skinWeaponId,
        price: parseFloat(price),
        float: parseFloat(float),
        wearId,
        imgLink,
        inspectLink,
        isStatTrak,
        hasStickers,
        hasLowFloat,
        tradeLockStartDate,
      }),
    });
  
    setNewSkinItem({
      id: null,
      skinWeaponId: null,
      skinId: null,
      weaponId: null,
      price: "",
      float: "",
      wearId: null,
      imgLink: "",
      inspectLink: "",
      isStatTrak: false,
      hasStickers: false,
      hasLowFloat: false,
      tradeLockStartDate: "",
    });
    setEditing(false);
    fetchSkinItems();
  };

  const editSkinItem = (item: SkinItem) => {
    setNewSkinItem({
      id: item.id,
      skinWeaponId: item.skinWeaponId,
      skinId: item.skinWeapon.skin.id,
      weaponId: item.skinWeapon.weapon.id,
      price: item.price.toString(),
      float: item.float.toString(),
      wearId: item.wearId,
      imgLink: item.imgLink,
      inspectLink: item.inspectLink,
      isStatTrak: item.isStatTrak,
      hasStickers: item.hasStickers,
      hasLowFloat: item.hasLowFloat,
      tradeLockStartDate: item.tradeLockStartDate || "",
    });
    setEditing(true);
  };

  const deleteSkinItem = async (id: number) => {
    if (confirm("Tem certeza de que deseja deletar esta skin?")) {
      await fetch(`/api/skinitem/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_TOKEN}`, // Envia o token no cabeçalho
        },
      });
      fetchSkinItems();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 bg-gray-700 text-white"
          />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 bg-gray-700 text-white"
          />
          <Button onClick={handleLogin} className="w-full bg-blue-600">
            Login
          </Button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="mb-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Skin Item" : "Add New Skin Item"}</h2>

            <select
              id="weaponId"
              name="weaponId"
              value={newSkinItem.weaponId || ""}
              onChange={(e) => handleWeaponChange(parseInt(e.target.value))}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              <option value="">Selecione a Arma</option>
              {weapons.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>{weapon.name}</option>
              ))}
            </select>

            <select
              id="skinId"
              name="skinId"
              value={newSkinItem.skinId || ""}
              onChange={(e) => handleSelectChange(e)}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              <option value="">Selecione a Skin</option>
              {filteredSkins.map((skin) => (
                <option key={skin.id} value={skin.id}>{skin.name}</option>
              ))}
            </select>

            <Input
              id="price"
              name="price"
              placeholder="Preço"
              value={newSkinItem.price}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <label className="text-white mb-4 my-4 mr-2">
              <input
                type="checkbox"
                checked={newSkinItem.isStatTrak}
                onChange={(e) => setNewSkinItem((prev) => ({ ...prev, isStatTrak: e.target.checked }))}
                className="mr-2 mb-4"
              />
              StatTrak
            </label>
            <label className="text-white mb-4 my-4 mr-2">
              <input
                type="checkbox"
                checked={newSkinItem.hasStickers}
                onChange={(e) => setNewSkinItem((prev) => ({ ...prev, hasStickers: e.target.checked }))}
                className="mr-2 mb-4"
              />
              Stickers
            </label>
            <label className="text-white mb-4 my-4">
              <input
                type="checkbox"
                checked={newSkinItem.hasLowFloat}
                onChange={(e) => setNewSkinItem((prev) => ({ ...prev, hasLowFloat: e.target.checked }))}
                className="mr-2 mb-4"
              />
              Good Float
            </label>
            <Input
              id="tradeLockStartDate"
              name="tradeLockStartDate"
              type="date"
              placeholder="Data de Bloqueio de Troca"
              value={newSkinItem.tradeLockStartDate}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              id="float"
              name="float"
              placeholder="Float"
              value={newSkinItem.float}
              onChange={(e) => handleFloatChange(e.target.value)}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              id="imgLink"
              name="imgLink"
              placeholder="URL da Imagem"
              value={newSkinItem.imgLink}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              id="inspectLink"
              name="inspectLink"
              placeholder="URL do Inspecionar"
              value={newSkinItem.inspectLink}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Button
              onClick={addOrUpdateSkinItem}
              className="w-full bg-green-600"
            >
              {editing ? "Save Changes" : "Add Skin Item"}
            </Button>
            {editing && (
              <Button
                onClick={() => {
                  setEditing(false);
                  setNewSkinItem({
                    id: null,
                    skinWeaponId: null,
                    skinId: null,
                    weaponId: null,
                    price: "",
                    float: "",
                    wearId: null,
                    imgLink: "",
                    inspectLink: "",
                    isStatTrak: false,
                    hasStickers: false,
                    hasLowFloat: false,
                    tradeLockStartDate: "",
                  });
                }}
                className="w-full mt-2 bg-red-600"
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Existing Skin Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
              {skinItems.map((item) => (
                <div key={item.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
                  <Image
                    src={item.imgLink}
                    alt={item.skinWeapon.skin.name}
                    width={132}
                    height={132}
                    unoptimized
                    objectFit="contain"
                    className="object-cover rounded-md mb-2 mx-auto"
                  />
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{item.skinWeapon.skin.name} {item.isStatTrak ? "(StatTrak™)" : ""}</span>
                    <span className="text-blue-400">R${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.skinWeapon.weapon.name} ({item.skinWeapon.weapon.weaponType.name})</p>
                  <p className="text-sm text-gray-400">Float: {item.float.toFixed(8)}</p>
                  <p className="text-sm text-gray-400 mb-2">Wear: {item.wear.name}</p>
                  <p className="text-sm text-gray-400">
                    {item.tradeLockStartDate
                      ? `Trade Lock Start: ${new Intl.DateTimeFormat('pt-BR', {
                          timeZone: 'UTC',
                        }).format(new Date(item.tradeLockStartDate))}`
                      : "No Trade Lock"}
                  </p>
                  <Button
                    onClick={() => editSkinItem(item)}
                    className="w-full bg-blue-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteSkinItem(item.id)}
                    className="w-full bg-red-600 mt-2"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
