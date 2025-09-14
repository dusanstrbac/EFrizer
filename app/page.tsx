'use client';
import { useState, useEffect } from "react";
import Kalendar from "@/components/ui/Kalendar";

export default function Home() {
  // State za radno vreme lokala (samo za učitavanje podataka, ako je potrebno)
  const [workingHours, setWorkingHours] = useState<any>(null);

  // Fetch radnog vremena
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await fetch('/baza/radnoVreme.json');
        const data = await response.json();
        setWorkingHours(data);
      } catch (error) {
        console.error('Failed to load working hours:', error);
      }
    };

    fetchWorkingHours();
  }, []);

  // Ako radno vreme nije učitano, prikazujemo loading
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
