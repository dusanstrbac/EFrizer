'use client';

import { useState, useEffect } from 'react';
import IzmeniMusterijaModal from './ui/IzmeniMusterijaModal';

interface Musterija {
  id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
}

const MusterijeTable = () => {
  const [musterije, setMusterije] = useState<Musterija[]>([]);
  const [selectedMusterija, setSelectedMusterija] = useState<Musterija | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetching data from the JSON file
  useEffect(() => {
    const fetchMusterije = async () => {
      try {
        const response = await fetch('/baza/musterije.json');
        const data = await response.json();
        setMusterije(data);
      } catch (error) {
        console.error('Failed to load musterije:', error);
      }
    };

    fetchMusterije();
  }, []);

  // Handle opening the modal with the selected customer
  const handleEdit = (musterija: Musterija) => {
    setSelectedMusterija(musterija);
    setIsModalOpen(true); // Open the modal when a customer is selected
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMusterija(null); // Clear the selected customer
  };

  // Handle saving the updated customer
  const handleSave = (updatedMusterija: Musterija) => {
    setMusterije((prevMusterije) =>
      prevMusterije.map((musterija) =>
        musterija.id === updatedMusterija.id ? updatedMusterija : musterija
      )
    );
  };

  return (
    <div className="overflow-x-auto p-4">
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
          {musterije.map((musterija) => (
            <tr key={musterija.id}>
              <td className="border px-4 py-2">{musterija.id}</td>
              <td className="border px-4 py-2">{musterija.ime}</td>
              <td className="border px-4 py-2">{musterija.prezime}</td>
              <td className="border px-4 py-2">{musterija.email}</td>
              <td className="border px-4 py-2">{musterija.telefon}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEdit(musterija)} // Open modal for the selected customer
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
    </div>
  );
};

export default MusterijeTable;
