'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion za animacije
import Button from './Button';
import { ClipboardClock, ClipboardList } from 'lucide-react';
import { KalendarProps } from '@/types/kalendar'; // Uvozimo KalendarProps tip
import ZakazivanjeTermina from '../ZakazivanjeTermina';

const KalendarModal: React.FC<KalendarProps> = ({ date, onClose }) => {
  // Formatiranje datuma u obliku "3. septembar 2025" na latinici
  const formattedDate = `${date.getDate()}. ${date.toLocaleString('sr-Latn-RS', { month: 'long' })} ${date.getFullYear()}`;

  // Stanje za klijente i učitane podatke
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); 
  const [isZakazivanjeOpen, setIsZakazivanjeOpen] = useState(false);

  // Učitaj termine za odabrani datum
  useEffect(() => {
    const fetchTermini = async () => {
      try {
        // Učitaj podatke sa lokalnog JSON fajla
        const response = await fetch('/baza/termini.json');
        
        // Proveri da li je odgovor uspešan
        if (!response.ok) {
          throw new Error(`Greška pri učitavanju podataka: ${response.status} ${response.statusText}`);
        }

        // Pokušaj da parsiraš odgovor kao JSON
        const data = await response.json();

        // Ako postoje termini za datum, postavljamo ih
        if (data[formattedDate]) {
          setClients(data[formattedDate]);
        } else {
          setClients([]); // Ako nema termina za datum, postavljamo prazan niz
          setError('Nema zakazanih termina trenutno za ovaj datum.');
        }
      } catch (error: any) {
        // U slučaju greške, postavljamo error u stanje ( ukoliko se recimo ne učita baza podataka )
        console.error('Greška pri učitavanju termina:', error);
        setError('Došlo je do greške prilikom učitavanja termina.');
        setClients([]); // Praznimo listu klijenata ako dođe do greške
      } finally {
        setLoading(false);
      }
    };

    fetchTermini();
  }, [formattedDate]);

  // Funkcija za otkazivanje termina
  const otkaziTermin = () => {
    if (clients.length === 0) {
      alert('Nemate nijedan aktivni termin za ovaj datum.');
    } else {
      // Prazan else blok za kasnija proširivanja
      alert('Otkazivanje termina...');
    }
  };

  const otvoriZakazivanjeModal = () => {
    setIsZakazivanjeOpen(true);
  };

  const zatvoriZakazivanjeModal = () => {
    setIsZakazivanjeOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white w-[90%] h-[90%] p-8 rounded-lg shadow-lg overflow-y-auto flex flex-col"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-between items-center mb-4 w-full border-b border-gray-300 pb-2">
          <h2 className="text-2xl font-bold">{formattedDate}</h2>
          <button onClick={onClose} className="text-2xl text-gray-600 hover:text-gray-900 cursor-pointer">X</button>
        </div>

        <div className="flex flex-col mb-4 w-full">
          <div className="mt-4">
            <h3 className="font-bold">Klijenti koji dolaze:</h3>
            {loading ? (
              <p>Učitavanje...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : clients.length === 0 ? (
              <p>Nema termina za ovaj datum.</p>
            ) : (
              <ul className="list-disc pl-5">
                {clients.map((client, index) => (
                  <li key={index} className="font-normal">
                    {client.name} - {client.service} - <span className="font-semibold">{client.time} </span> 
                    - <span className="font-semibold">{client.price} RSD</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-auto flex gap-2 border-t border-gray-300 pt-4">
        <Button
          title="Otkaži termin"
          icon={<ClipboardClock />}
          className="transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white"
          action={otkaziTermin}
        />
          <Button 
            title="Zakaži termin" 
            icon={<ClipboardClock />} 
            className="transition-all duration-200 ease-in-out hover:bg-green-500 hover:text-white"
            action={otvoriZakazivanjeModal}
          />
          <Button 
            title="Štampaj listing" 
            icon={<ClipboardList />} 
            className="transition-all duration-200 ease-in-out hover:bg-yellow-500 hover:text-white"
            action={() => alert('Štampanje listinga')}
          />
        </div>
          {/* Prikaz ZakazivanjeTermina modala ako je otvoren */}
          {isZakazivanjeOpen && <ZakazivanjeTermina onClose={zatvoriZakazivanjeModal} date={selectedDate} />}
      </motion.div>
    </div>
  );
};

export default KalendarModal;
