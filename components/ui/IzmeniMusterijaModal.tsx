'use client';

import React, { useState } from 'react';
import Button from './Button';
import { Edit, X } from 'lucide-react'; // Importuj X ikonu za zatvaranje
import { Musterija } from '@/types/musterija';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMusterija: Musterija) => void;
  musterija: Musterija;
}

const IzmeniMusterijaModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, musterija }) => {
  const [updatedMusterija, setUpdatedMusterija] = useState(musterija);

  if (!isOpen) return null; // Ako modal nije otvoren, ne prikazuj ništa


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setUpdatedMusterija({
      ...updatedMusterija,
      [field]: e.target.value
    });
  };

  const handleSave = () => {
    onSave(updatedMusterija); // Šalje izmenjenu mušteriju na roditeljsku komponentu
    onClose(); // Zatvara modal
  };

  // Funkcija za promenu boje ikone na osnovu aktivnog stanja
  const iconColor = 'text-green-500';  // Primer boje kada je dugme aktivno

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
        {/* Ikona za zatvaranje */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Edit className={`${iconColor} text-xl`} /> Izmeni podatke mušteriji
        </h2>
        <form>
          <div className="mb-4">
            <label htmlFor="ime" className="block mb-2">Ime</label>
            <input
              type="text"
              id="ime"
              value={updatedMusterija.ime}
              onChange={(e) => handleInputChange(e, 'ime')}
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="prezime" className="block mb-2">Prezime</label>
            <input
              type="text"
              id="prezime"
              value={updatedMusterija.prezime}
              onChange={(e) => handleInputChange(e, 'prezime')}
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={updatedMusterija.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefon" className="block mb-2">Telefon</label>
            <input
              type="text"
              id="telefon"
              value={updatedMusterija.telefon}
              onChange={(e) => handleInputChange(e, 'telefon')}
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              title="Otkaži"
              action={onClose}
              buttonType="default"
              className="bg-gray-500 text-black"
            />
            <Button
              title="Obriši"
              action={() => alert('Obrisano!')} // Stub funkcionalnosti
              buttonType="nalog"
              className="bg-red-500 text-black"
            />
            <Button
              title="Sačuvaj"
              action={handleSave}
              buttonType="musterije"
              className="bg-green-500 text-black"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default IzmeniMusterijaModal;
