'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Skin {
  id: number;
  name: string;
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
  skinWeaponId: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [wears, setWears] = useState<Wear[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [skinItems, setSkinItems] = useState<SkinItem[]>([]);

  const [newSkinItem, setNewSkinItem] = useState({
    id: null as number | null, // Agora usamos o ID do SkinItem para edição
    skinWeaponId: null as number | null,
    skinId: null as number | null,
    weaponId: null as number | null,
    price: "",
    float: "",
    wearId: null as number | null,
    imgLink: "",
    inspectLink: "",
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSkinItems();
      fetchWears();
      fetchWeapons();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (username === '123' && password === '123') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const fetchWears = async () => {
    const response = await fetch('/api/wears');
    const data: Wear[] = await response.json();
    setWears(data);
  };

  const fetchWeapons = async () => {
    const response = await fetch('/api/weapons');
    const data: Weapon[] = await response.json();
    setWeapons(data);
  };

  const fetchSkinItems = async () => {
    const response = await fetch('/api/skinitem');
    const data: SkinItem[] = await response.json();
    setSkinItems(data);
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

  const handleSkinSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const response = await fetch(`/api/skins?search=${query}`);
      const data: Skin[] = await response.json();
      setFilteredSkins(data);
    } else {
      setFilteredSkins([]);
    }
  };

  const fetchSkinWeaponId = async (skinId: number, weaponId: number) => {
    try {
      const response = await fetch(`/api/skinweapon?skinId=${skinId}&weaponId=${weaponId}`);
      const data = await response.json();
      if (data && data.id) {
        setNewSkinItem((prev) => ({ ...prev, skinWeaponId: data.id }));
      } else {
        alert("Combinação de Skin e Arma não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar skinWeaponId:", error);
    }
  };

  const addOrUpdateSkinItem = async () => {
    const { id, skinWeaponId, price, float, wearId, imgLink, inspectLink } = newSkinItem;

    if (!skinWeaponId || !price.trim() || !float.trim() || !imgLink.trim() || !inspectLink.trim() || wearId === null) {
      alert("Preencha todos os campos antes de adicionar o produto.");
      return;
    }

    const endpoint = id ? `/api/skinitem/${id}` : '/api/skinitem'; // Usa o ID do SkinItem para PUT
    const method = id ? 'PUT' : 'POST';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skinWeaponId,
        price: parseFloat(price),
        float: parseFloat(float),
        wearId,
        imgLink,
        inspectLink,
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
    });
    setEditing(true);
  };

  const deleteSkinItem = async (id: number) => {
    if (confirm("Tem certeza de que deseja deletar esta skin?")) {
      await fetch(`/api/skinitem/${id}`, {
        method: 'DELETE',
      });
      fetchSkinItems(); // Atualiza a lista após deletar
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
              onChange={(e) => {
                handleSelectChange(e);
                const weaponId = parseInt(e.target.value);
                if (newSkinItem.skinId && weaponId) {
                  fetchSkinWeaponId(newSkinItem.skinId, weaponId);
                }
              }}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              <option value="">Selecione a Arma</option>
              {weapons.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>{weapon.name}</option>
              ))}
            </select>

            <Input
              id="search"
              name="search"
              placeholder="Search Skin..."
              value={searchQuery}
              onChange={(e) => handleSkinSearch(e.target.value)}
              className="mb-4 bg-gray-700 text-white"
            />
            {filteredSkins.length > 0 && (
              <ul className="bg-gray-700 rounded-lg max-h-40 overflow-y-auto">
                {filteredSkins.map((skin) => (
                  <li
                    key={skin.id}
                    onClick={() => {
                      setNewSkinItem((prev) => ({ ...prev, skinId: skin.id }));
                      setFilteredSkins([]);
                      setSearchQuery(skin.name);
                      if (newSkinItem.weaponId) {
                        fetchSkinWeaponId(skin.id, newSkinItem.weaponId);
                      }
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-600"
                  >
                    {skin.name}
                  </li>
                ))}
              </ul>
            )}

            <Input
              id="price"
              name="price"
              placeholder="Preço"
              value={newSkinItem.price}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              id="float"
              name="float"
              placeholder="Float"
              value={newSkinItem.float}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <select
              id="wearId"
              name="wearId"
              value={newSkinItem.wearId || ""}
              onChange={handleSelectChange}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              {wears.map((wear) => (
                <option key={wear.id} value={wear.id}>{wear.name}</option>
              ))}
            </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {skinItems.map((item) => (
                <div key={item.id} className="bg-gray-900 p-4 rounded-lg shadow-lg max-w-xs">
                  <img src={item.imgLink} alt={item.skinWeapon.skin.name} className="w-32 h-32 object-cover rounded-md mb-4" />
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{item.skinWeapon.skin.name}</span>
                    <span className="text-blue-400">R${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{item.skinWeapon.weapon.name} ({item.skinWeapon.weapon.weaponType.name})</p>
                  <p className="text-sm text-gray-400">Float: {item.float.toFixed(8)}</p>
                  <p className="text-sm text-gray-400 mb-2">Wear: {item.wear.name}</p>
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
