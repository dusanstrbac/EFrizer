'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Ikonice za strelice
import KalendarModal from './KalendarModal';

// Helper funkcije za rad sa datumima
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  return date.getDate();
};

const getStartDayOfMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);
  return date.getDay(); // Vraća dan u nedelji kada mesec počinje (0 - Nedelja, 1 - Ponedeljak...)
};

const getEndDayOfMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  return date.getDay(); // Vraća dan u nedelji kada mesec završava (0 - Nedelja, 1 - Ponedeljak...)
};

const months = [
  'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
];

const fullWeekDays = [
  'Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'
];

const Kalendar: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  // Selektovani datum
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // Trenutni mesec
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear()); // Trenutna godina
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Da li je modal otvoren
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false); // Da li je dropdown otvoren

  const daysInMonth = getDaysInMonth(currentYear, currentMonth + 1);
  const startDay = getStartDayOfMonth(currentYear, currentMonth + 1); // Dan početka meseca
  const endDay = getEndDayOfMonth(currentYear, currentMonth + 1); // Dan završetka meseca

  const handleDayClick = (day: number, month: number, year: number) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);  // Odmah postavi selektovani datum i ofarbi dan

    // Ako je kliknuti dan iz drugog meseca, menjamo mesec
    if (month !== currentMonth) {
      setCurrentMonth(month);
      setCurrentYear(year);
    }
  };

  const handleDayDoubleClick = (day: number, month: number, year: number) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);  // Postavljanje selektovanog datuma
    setIsModalOpen(true); // Otvori modal kada se dvaput klikne na dan

    // Ako je kliknuti dan iz drugog meseca, menjamo mesec
    if (month !== currentMonth) {
      setCurrentMonth(month);
      setCurrentYear(year);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1); // Ako je januar, prebacujemo na decembar prošle godine
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1); // Ako je decembar, prebacujemo na januar sledeće godine
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const toggleSelect = () => {
    setIsSelectOpen(prev => !prev);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setIsSelectOpen(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setIsSelectOpen(false);
  };

  const renderDays = () => {
    const days = [];
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth); // Broj dana u prethodnom mesecu

    // Dodajemo dane iz prethodnog meseca ako mesec ne počinje od nedelje
    for (let i = 0; i < startDay; i++) {
      const prevMonthDay = prevMonthDays - startDay + i + 1;
      days.push(
        <button
          key={`prev-${i}`}
          onClick={() => handleDayClick(prevMonthDay, currentMonth - 1 < 0 ? 11 : currentMonth - 1, currentMonth - 1 < 0 ? currentYear - 1 : currentYear)}
          onDoubleClick={() => handleDayDoubleClick(prevMonthDay, currentMonth - 1 < 0 ? 11 : currentMonth - 1, currentMonth - 1 < 0 ? currentYear - 1 : currentYear)}
          className="relative w-full h-24 flex items-center justify-center cursor-pointer border rounded-lg bg-gray-100 opacity-60">
          {/* Prazni dani iz prethodnog meseca */}
          <span className="absolute top-2 right-2 text-sm font-semibold text-gray-400">{prevMonthDay}</span>
        </button>
      );
    }

    // Dodajemo stvarne dane meseca
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate?.getDate() === day && selectedDate.getMonth() === currentMonth;
      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear; // Da li je danasšnji dan

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day, currentMonth, currentYear)}
          onDoubleClick={() => handleDayDoubleClick(day, currentMonth, currentYear)}
          className={`relative w-full h-24 flex items-center justify-center cursor-pointer border rounded-lg overflow-hidden ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'} ${isToday ? 'border-2 border-red-500 text-red-500' : ''}`}>
          {/* Broj dana u gornjem desnom kutu */}
          <span className={`absolute top-2 right-2 text-sm font-semibold ${isToday ? 'text-red-500' : ''}`}>{day}</span>
        </button>
      );
    }

    // Dodajemo dane iz sledećeg meseca samo ako je poslednji dan meseca u petak ili pre
    const nextMonthStart = 1;
    const remainingCells = 7 - (endDay + 1); // Preostale ćelije koje treba popuniti
    if (remainingCells > 0) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(
          <button
            key={`next-${i}`}
            onClick={() => handleDayClick(nextMonthStart + i, currentMonth + 1 > 11 ? 0 : currentMonth + 1, currentMonth + 1 > 11 ? currentYear + 1 : currentYear)}
            onDoubleClick={() => handleDayDoubleClick(nextMonthStart + i, currentMonth + 1 > 11 ? 0 : currentMonth + 1, currentMonth + 1 > 11 ? currentYear + 1 : currentYear)}
            className="relative w-full h-24 flex items-center justify-center cursor-pointer border rounded-lg bg-gray-100 opacity-60">
            {/* Prazni dani iz sledećeg meseca */}
            <span className="absolute top-2 right-2 text-sm font-semibold text-gray-400">{nextMonthStart + i}</span>
          </button>
        );
      }
    }

    return days;
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div onClick={handlePreviousMonth} className="p-2 cursor-pointer text-xl text-gray-600 hover:bg-gray-100 rounded-full transition duration-300 ease-in-out">
          <ChevronLeft />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">{`${months[currentMonth]} ${currentYear}`}</span>
          <button onClick={toggleSelect} className="text-sm text-gray-600">
            {/* Prikazivanje ikone za otvaranje dropdown-a */}
            <span className='cursor-pointer'>&#9660;</span>
          </button>
        </div>

        <div onClick={handleNextMonth} className="p-2 cursor-pointer text-xl text-gray-600 hover:bg-gray-100 rounded-full transition duration-300 ease-in-out">
          <ChevronRight />
        </div>
      </div>

      {/* Dropdown za izbor meseca i godine */}
      {isSelectOpen && (
        <div className="absolute top-16 bg-white shadow-md rounded-lg p-4 w-48 z-10">
          <div>
            <label className="block text-sm font-semibold">Izaberi mesec</label>
            <select
              value={currentMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="w-full mt-2 border rounded-md p-2"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold">Izaberi godinu</label>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="w-full mt-2 border rounded-md p-2 cursor-pointer"
            >
              {Array.from({ length: 20 }, (_, i) => currentYear - 10 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSelectOpen(false)}
              className="w-full text-white bg-red-500 hover:bg-red-600 rounded-md p-2 cursor-pointer">
              Zatvori
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 mt-4">
        {/* Dan u nedelji */}
        {fullWeekDays.map((day, index) => (
          <div key={index} className="text-center font-semibold">{day}</div>
        ))}

        {/* Renderovanje dana */}
        {renderDays()}
      </div>

      {isModalOpen && selectedDate && <KalendarModal date={selectedDate} onClose={closeModal} />}
    </div>
  );
};

export default Kalendar;
