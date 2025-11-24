// components/TopNavigation.tsx
'use client';
import { useState, useEffect } from "react";

interface DayHours {
  open: string;   // "HH:mm"
  close: string;  // "HH:mm"
}

type WorkingHours = Record<string, DayHours>;

const TopNavigation = () => {
  // State za radno vreme lokala
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);

  // Funkcija koja dobija današnji datum i vreme
  const today = new Date();

  // Formatiranje datuma u obliku "9. septembar 2025" na latinici
  const formattedDate = today.toLocaleDateString('sr-Latn-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Dobijanje trenutnog dana u nedelji (0 - nedelja, 1 - ponedeljak, ... 6 - subota)
  const currentDay = today.getDay(); // Nedeljom je 0, ponedeljak je 1 itd.
  const daysOfWeek = [
    "nedelja", "ponedeljak", "utorak", "sreda", "cetvrtak", "petak", "subota"
  ];

  // Dobijanje trenutnog vremena u formatu HH:mm
  const currentTime = today.getHours() * 60 + today.getMinutes(); // Pretvaranje u minute

  // Fetch radnog vremena
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch('/baza/radnoVreme.json'); // Putanja do JSON-a
        const data = await response.json();
        setWorkingHours(data);
      } catch (error) {
        console.error('Failed to load working hours:', error);
      }
    };

    fetchWorkingHours();
  }, []);

  // Ako radno vreme nije učitano, prikaži loading
  if (!workingHours) {
    return <div>Loading...</div>;
  }

  // Funkcija za prikazivanje statusa svakog dana
  const getDayStatus = (day: string) => {
    const openTime = workingHours[day]?.open.split(":");
    const closeTime = workingHours[day]?.close.split(":");

    const openMinutes = Number(openTime[0]) * 60 + Number(openTime[1]); // Pretvaranje u minute
    const closeMinutes = Number(closeTime[0]) * 60 + Number(closeTime[1]); // Pretvaranje u minute

    const isOpen = openMinutes !== 0 && closeMinutes !== 0 && currentTime >= openMinutes && currentTime < closeMinutes;

    return isOpen ? "Otvoreno" : "Zatvoreno";
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-300 px-4 py-2">
      {/* Radno vreme i status u manjem formatu */}
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-medium text-gray-600">Status lokala:</h3>
        <span className={`font-bold text-sm ${getDayStatus(daysOfWeek[currentDay]) === "Otvoreno" ? 'text-green-600' : 'text-red-600'}`}>
          {getDayStatus(daysOfWeek[currentDay])}
        </span>
      </div>

      {/* Prikazivanje današnjeg datuma */}
      <div className="flex items-center space-x-4">
        <h3 className="text-sm font-bold">{formattedDate}</h3> {/* Prikazivanje današnjeg datuma */}
      </div>
    </div>
  );
};

export default TopNavigation;
