'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Skin {
  id: number;
  name: string;
  price: string;
  float: string;
  wearId: number;
  weaponId: number;
  image: string;
  inspectLink: string;
}

interface Wear {
  id: number;
  name: string;
}

interface WeaponType {
  id: number;
  name: string;
}

interface Weapon {
  id: number;
  name: string;
  weaponTypeId: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [skins, setSkins] = useState<Skin[]>([]);
  const [editingSkin, setEditingSkin] = useState<Skin | null>(null);

  const [wears, setWears] = useState<Wear[]>([]);
  const [weaponTypes, setWeaponTypes] = useState<WeaponType[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);

  const [newSkin, setNewSkin] = useState<Omit<Skin, 'id'>>({
    name: "",
    price: "",
    float: "",
    wearId: 0,
    weaponId: 0,
    image: "",
    inspectLink: ""
  });

  const handleLogin = () => {
    if (username === '123' && password === '123') {
      setIsAuthenticated(true);
      fetchSkins();
      fetchWears();
      fetchWeaponTypes();
      fetchWeapons();
    } else {
      alert('Credenciais inválidas');
    }
  };

  const fetchSkins = async () => {
    const response = await fetch('/api/skins');
    const data: Skin[] = await response.json();
    setSkins(data);
  };

  const fetchWears = async () => {
    const response = await fetch('/api/wears');
    const data: Wear[] = await response.json();
    setWears(data);
  };

  const fetchWeaponTypes = async () => {
    const response = await fetch('/api/weapon_types');
    const data: WeaponType[] = await response.json();
    setWeaponTypes(data);
  };

  const fetchWeapons = async () => {
    const response = await fetch('/api/weapons');
    const data: Weapon[] = await response.json();
    setWeapons(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSkin((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const addSkin = async () => {
    if (!newSkin.name || !newSkin.price || !newSkin.float || !newSkin.image || !newSkin.inspectLink || !newSkin.wearId || !newSkin.weaponId) {
      alert("Preencha todos os campos antes de adicionar a skin.");
      return;
    }

    await fetch('/api/skins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkin),
    });

    fetchSkins();
    setNewSkin({ name: "", price: "", float: "", wearId: 0, weaponId: 0, image: "", inspectLink: "" });
  };

  const updateSkin = async () => {
    if (editingSkin) {
      await fetch(`/api/skins`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkin),
      });

      fetchSkins();
      setEditingSkin(null);
    }
  };

  const deleteSkin = async (id: number) => {
    await fetch('/api/skins', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSkins();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 bg-gray-700 text-white"
          />
          <Input
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

          {/* Formulário para adicionar uma nova skin */}
          <div className="mb-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Adicionar Nova Skin</h2>
            <Input
              name="name"
              placeholder="Nome da Skin"
              value={newSkin.name}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              name="price"
              placeholder="Preço"
              value={newSkin.price}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              name="float"
              placeholder="Float"
              value={newSkin.float}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <select
              name="wearId"
              value={newSkin.wearId}
              onChange={handleSelectChange}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              <option value="">Selecione a Condição</option>
              {wears.map((wear) => (
                <option key={wear.id} value={wear.id}>{wear.name}</option>
              ))}
            </select>
            <select
              name="weaponId"
              value={newSkin.weaponId}
              onChange={handleSelectChange}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              <option value="">Selecione a Arma</option>
              {weapons.map((weapon) => (
                <option key={weapon.id} value={weapon.id}>{weapon.name}</option>
              ))}
            </select>
            <Input
              name="image"
              placeholder="URL da Imagem"
              value={newSkin.image}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Input
              name="inspectLink"
              placeholder="URL do Inspecionar"
              value={newSkin.inspectLink}
              onChange={handleInputChange}
              className="mb-4 bg-gray-700 text-white"
            />
            <Button onClick={addSkin} className="w-full bg-green-600">
              Adicionar Skin
            </Button>
          </div>

          {/* Lista de skins com opção de edição */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skins.map((skin) => (
              <Card key={skin.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="p-4">
                  <CardTitle className="text-xl text-white">{skin.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>Price: {skin.price}</p>
                  <p>Float: {skin.float}</p>
                  <p>Inspect Link: <a href={skin.inspectLink} target="_blank" className="text-blue-400">Inspecionar</a></p>
                  <p>Wear: {wears.find((w) => w.id === skin.wearId)?.name || "N/A"}</p>
                  <p>Weapon: {weapons.find((w) => w.id === skin.weaponId)?.name || "N/A"}</p>
                  <Button
                    onClick={() => setEditingSkin(skin)}
                    className="mt-4 bg-yellow-600 w-full"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteSkin(skin.id)}
                    className="mt-2 bg-red-600 w-full"
                  >
                    Delete Skin
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
