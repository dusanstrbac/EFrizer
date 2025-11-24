'use client';
import { useState, useEffect } from "react";
import Kalendar from "@/components/ui/Kalendar";
import { Firma } from "@/types/firma";
import { useCookies } from "react-cookie";

interface DayHours {
  open: string;   // "HH:mm"
  close: string;  // "HH:mm"
}

type WorkingHours = Record<string, DayHours>;

export default function Home() {
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);

  // Fetch radnog vremena
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch('/baza/radnoVreme.json');
        const data = await response.json();
        setWorkingHours(data);
      } catch (error : unknown) {
        console.error('Greška prilikom učitavanja radnog vremena:', error);
      }
    };

    fetchWorkingHours();
  }, []);

  if (!workingHours) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Kalendar */}
      <Kalendar />
    </div>
  );
}
