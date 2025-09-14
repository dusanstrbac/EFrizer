'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import IzmeniMusterijaModal from './ui/IzmeniMusterijaModal';
import Button from './ui/Button';
import DodajKorisnika from './DodajKorisnika'; // Importujemo novu komponentu

interface Musterija {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
}

const MusterijeTable = () => {
  const [musterije, setMusterije] = useState<Musterija[]>([]);
  const [filteredMusterije, setFilteredMusterije] = useState<Musterija[]>([]);
  const [selectedMusterija, setSelectedMusterija] = useState<Musterija | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Za otvaranje novog modala
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMusterije = async () => {
      try {
        const response = await fetch('/baza/musterije.json');
        const data = await response.json();
        setMusterije(data);
        setFilteredMusterije(data);
      } catch (error) {
        console.error('Greška prilikom učitavanja musterija:', error);
      }
    };

    fetchMusterije();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredMusterije(musterije);
    } else {
      setFilteredMusterije(
        musterije.filter(
          (musterija) =>
            musterija.ime.toLowerCase().includes(searchQuery.toLowerCase()) ||
            musterija.prezime.toLowerCase().includes(searchQuery.toLowerCase()) ||
            musterija.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            musterija.telefon.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, musterije]);

  const handleEdit = (musterija: Musterija) => {
    setSelectedMusterija(musterija);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMusterija(null);
  };

  const handleSave = (updatedMusterija: Musterija) => {
    setMusterije((prevMusterije) =>
      prevMusterije.map((musterija) =>
        musterija.id === updatedMusterija.id ? updatedMusterija : musterija
      )
    );
  };

  const handleAddUser = (noviKorisnik: { ime: string; prezime: string; email: string; telefon: string }) => {
    const newUser = {
      id: musterije.length + 1,
      ...noviKorisnik,
    };
    setMusterije([...musterije, newUser]);
  };

  return (
    <div className="overflow-x-auto p-4">
      {/* Pretraga */}
      <div className="flex items-center mb-4 justify-between">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full border px-4 py-1 rounded-lg pl-8"
          />
          <Search className="absolute left-3 top-1 text-gray-500" width={18} />
        </div>
        
        {/* Dugme za Novi korisnik */}
        <div>
          <Button
            title="Novi korisnik"
            icon={<Plus width={18} />}
            action={() => setIsAddModalOpen(true)} // Otvara modal kada se klikne
            buttonType="noviKorisnik"
            className="flex items-center px-6 py-2 rounded-lg shadow-lg transition-colors duration-300"
          />
        </div>
      </div>

      {/* Tabela */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Ime</th>
            <th className="border px-4 py-2 text-left">Prezime</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Telefon</th>
            <th className="border px-4 py-2 text-left">Akcija</th>
          </tr>
        </thead>
        <tbody>
          {filteredMusterije.map((musterija) => (
            <tr key={musterija.id}>
              <td className="border px-4 py-2">{musterija.id}</td>
              <td className="border px-4 py-2">{musterija.ime}</td>
              <td className="border px-4 py-2">{musterija.prezime}</td>
              <td className="border px-4 py-2">{musterija.email}</td>
              <td className="border px-4 py-2">{musterija.telefon}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-80"
                  onClick={() => handleEdit(musterija)}
                >
                  Izmeni
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal za izmenu mušterije */}
      {selectedMusterija && (
        <IzmeniMusterijaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          musterija={selectedMusterija}
        />
      )}

      {/* Modal za dodavanje korisnika */}
      <DodajKorisnika
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddUser}
      />
    </div>
  );
};

export default MusterijeTable;
