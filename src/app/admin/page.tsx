'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Skin {
  id: number;
  name: string;
  price: string;
  float: string;
  wear: WearCondition;
  image: string;
}

enum WearCondition {
  FactoryNew = "Factory New",
  MinimalWear = "Minimal Wear",
  FieldTested = "Field-Tested",
  WellWorn = "Well-Worn",
  BattleScarred = "Battle-Scarred"
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [skins, setSkins] = useState<Skin[]>([]);
  const [editingSkin, setEditingSkin] = useState<Skin | null>(null);

  // Estado para os campos do formulário
  const [newSkin, setNewSkin] = useState<Omit<Skin, 'id'>>({
    name: "",
    price: "",
    float: "",
    wear: WearCondition.FactoryNew,
    image: ""
  });

  const handleLogin = () => {
    if (username === '123' && password === '123') {
      setIsAuthenticated(true);
      fetchSkins();
    } else {
      alert('Credenciais inválidas');
    }
  };

  const fetchSkins = async () => {
    const response = await fetch('/api/skins');
    const data: Skin[] = await response.json();
    setSkins(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingSkin) {
      setEditingSkin({ ...editingSkin, [name]: value });
    } else {
      setNewSkin((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wear = e.target.value as WearCondition;
    if (editingSkin) {
      setEditingSkin({ ...editingSkin, wear });
    } else {
      setNewSkin((prev) => ({ ...prev, wear }));
    }
  };

  const addSkin = async () => {
    if (!newSkin.name || !newSkin.price || !newSkin.float || !newSkin.image) {
      alert("Preencha todos os campos antes de adicionar a skin.");
      return;
    }

    await fetch('/api/skins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkin),
    });

    fetchSkins();
    setNewSkin({ name: "", price: "", float: "", wear: WearCondition.FactoryNew, image: "" });
  };

  const updateSkin = async () => {
    if (editingSkin) {
      await fetch(`/api/skins`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingSkin,
          price: parseFloat(editingSkin.price),
          float: parseFloat(editingSkin.float),
        }),
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
              name="wear"
              value={newSkin.wear}
              onChange={handleWearChange}
              className="mb-4 bg-gray-700 text-white w-full p-2 rounded-md"
            >
              {Object.values(WearCondition).map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <Input
              name="image"
              placeholder="URL da Imagem"
              value={newSkin.image}
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
                  {editingSkin?.id === skin.id ? (
                    <div>
                      <Input
                        name="name"
                        placeholder="Nome da Skin"
                        value={editingSkin.name}
                        onChange={handleInputChange}
                        className="mb-2 bg-gray-800 text-white"
                      />
                      <Input
                        name="price"
                        placeholder="Preço"
                        value={editingSkin.price}
                        onChange={handleInputChange}
                        className="mb-2 bg-gray-800 text-white"
                      />
                      <Input
                        name="float"
                        placeholder="Float"
                        value={editingSkin.float}
                        onChange={handleInputChange}
                        className="mb-2 bg-gray-800 text-white"
                      />
                      <select
                        name="wear"
                        value={editingSkin.wear}
                        onChange={handleWearChange}
                        className="mb-2 bg-gray-800 text-white w-full p-2 rounded-md"
                      >
                        {Object.values(WearCondition).map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                      <Input
                        name="image"
                        placeholder="URL da Imagem"
                        value={editingSkin.image}
                        onChange={handleInputChange}
                        className="mb-2 bg-gray-800 text-white"
                      />
                      <Button onClick={updateSkin} className="bg-green-600 w-full mt-2">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p>Price: {skin.price}</p>
                      <p>Float: {skin.float}</p>
                      <p>Wear: {skin.wear}</p>
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
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
