'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import { X } from 'lucide-react'; // Dodajemo ikonu za zatvaranje
import { z } from 'zod';

// Kreiranje Zod sheme za validaciju
const korisnikSchema = z.object({
  ime: z.string().min(1, 'Ime je obavezno'),
  prezime: z.string().min(1, 'Prezime je obavezno'),
  email: z.string().email('Neispravan email').min(1, 'Email je obavezan'),
  telefon: z.string()
    .min(1, 'Telefon je obavezan')
    .regex(/^\+(\d{1,})$/, 'Telefon mora početi sa + oznakom i može imati samo brojeve')
});

type Korisnik = z.infer<typeof korisnikSchema>;

interface DodajKorisnikaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noviKorisnik: Korisnik) => void;
}

const DodajKorisnika: React.FC<DodajKorisnikaProps> = ({ isOpen, onClose, onSave }) => {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [errors, setErrors] = useState<Partial<Korisnik>>({});

  const handleSubmit = () => {
    const result = korisnikSchema.safeParse({ ime, prezime, email, telefon });

    if (result.success) {
      const noviKorisnik = { ime, prezime, email, telefon };
      onSave(noviKorisnik);
      onClose(); // Zatvori modal nakon što se korisnik doda
    } else {
      // Prikazivanje grešaka ako validacija nije uspela
      const formErrors: Partial<Korisnik> = {};

      if (result.error && result.error.issues) {
        result.error.issues.forEach((err) => {
          formErrors[err.path[0] as keyof Korisnik] = err.message;
        });
      }
      setErrors(formErrors);
    }
  };

  if (!isOpen) return null; // Ne renderuj ako modal nije otvoren

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg relative">
        {/* Ikona za zatvaranje */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl mb-4">Dodaj novu mušteriju</h2>
        
        {/* Polje za ime */}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="ime">Ime</label>
          <input
            type="text"
            id="ime"
            className="w-full border px-4 py-2 rounded-md"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
          />
          {errors.ime && <p className="text-red-500 text-sm">{errors.ime}</p>}
        </div>

        {/* Polje za prezime */}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="prezime">Prezime</label>
          <input
            type="text"
            id="prezime"
            className="w-full border px-4 py-2 rounded-md"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
          />
          {errors.prezime && <p className="text-red-500 text-sm">{errors.prezime}</p>}
        </div>

        {/* Polje za email */}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full border px-4 py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Polje za telefon */}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="telefon">Telefon</label>
          <input
            type="text"
            id="telefon"
            className="w-full border px-4 py-2 rounded-md"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
          />
          {errors.telefon && <p className="text-red-500 text-sm">{errors.telefon}</p>}
        </div>

        {/* Dugmad za otkazivanje i dodavanje */}
        <div className="flex justify-between gap-4">
          <Button
            title="Otkazi"
            action={onClose}
            buttonType="default"
            className="px-6 py-2 rounded-md"
          />
          <Button
            title="Dodaj"
            action={handleSubmit}
            buttonType="musterije"
            className="px-6 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default DodajKorisnika;
