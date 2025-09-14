import React, { useEffect, useState } from "react";

const ZakazivanjeTermina = ({
  onClose,
  date, // Dodajemo datum kao prop
}: {
  onClose: () => void;
  date: Date; // Tip za datum
}) => {
  const [services, setServices] = useState<any[]>([]); // Stanje za usluge
  const [selectedService, setSelectedService] = useState<string>(''); // Stanje za selektovanu uslugu
  const [userName, setUserName] = useState<string>(''); // Stanje za ime i prezime korisnika
  const [arrivalTime, setArrivalTime] = useState<string>(''); // Stanje za vreme dolaska korisnika
  const [loading, setLoading] = useState<boolean>(true); // Za praćenje učitavanja
  const [error, setError] = useState<string | null>(null); // Za greške
  const [selectedAddress, setSelectedAddress] = useState<string>(''); // Stanje za selektovanu adresu salona
  const [addresses, setAddresses] = useState<any[]>([]); // Stanje za adrese salona

  // Formatiraj datum u obliku "3. septembar 2025"
  const formattedDate = `${date.getDate()}. ${date.toLocaleString("sr-Latn-RS", { month: "long" })} ${date.getFullYear()}`;

  // Funkcija za učitavanje usluga sa JSON fajla
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Učitavanje usluga sa lokalnog JSON fajla
        const response = await fetch('/baza/usluge.json');
        if (!response.ok) {
          throw new Error(`Greška pri učitavanju usluga: ${response.status}`);
        }
        const data = await response.json();
        setServices(data); // Postavi učitane usluge
      } catch (error: any) {
        console.error('Greška pri učitavanju usluga:', error);
        setError('Došlo je do greške prilikom učitavanja usluga.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Prazan niz znači da se pokreće samo pri učitavanju komponente

  // Funkcija za učitavanje adresa sa JSON fajla
    useEffect(() => {
    const fetchAddresses = async () => {
        try {
        // Učitavanje adresa sa lokalnog JSON fajla
        const response = await fetch('/baza/adrese.json');
        if (!response.ok) {
            throw new Error(`Greška pri učitavanju adresa: ${response.statusText}`);
        }
        const data = await response.json();
        setAddresses(data); // Postavi učitane adrese
        setSelectedAddress(data[0]?.name || ''); // Postavi prvu adresu kao default
        } catch (error: any) {
        console.error('Greška pri učitavanju adresa:', error);
        setError('Došlo je do greške prilikom učitavanja adresa.');
        }
    };

    fetchAddresses();
    }, []); // Pokreće se samo pri učitavanju komponente


  // Funkcija za zakazivanje termina
  const rezervisiTermin = () => {
    if (!selectedService || !userName || !arrivalTime || !selectedAddress) {
      alert("Sva polja moraju biti popunjena da bi ste rezervisali novi termin.");
      return;
    }
    alert(`Termin zakazan za uslugu: ${selectedService}, korisnik: ${userName}, vreme dolaska: ${arrivalTime}, adresa salona: ${selectedAddress}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] h-[90%] p-8 rounded-lg shadow-lg overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-4 w-full border-b border-gray-300 pb-2">
          <h2 className="text-2xl font-bold">Zakazivanje termina za {formattedDate}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Polje za unos imena i prezimena korisnika */}
        <div className="mt-4">
          <label className="font-bold block">Ime i Prezime</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Unesite ime i prezime korisnika"
          />
        </div>

        {/* Sadržaj za zakazivanje termina */}
        <div className="flex flex-col gap-4 mt-6">
          <h3 className="font-bold">Odaberite uslugu</h3>
          {loading ? (
            <p>Učitavanje usluga...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full p-2 border rounded-md cursor-pointer"
            >
              <option value="" disabled>Izaberite uslugu</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price} RSD
                </option>
              ))}
            </select>
          )}

          {/* Polje za unos vremena dolaska */}
          <div className="mt-4">
            <label className="font-bold block">Vreme dolaska</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Select box za adresu salona */}
          <div className="mt-4">
            <label className="font-bold block">Adresa salona</label>
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full p-2 border rounded-md cursor-pointer"
            >
              <option value="" disabled>Izaberite adresu</option>
              {addresses.map((address) => (
                <option key={address.id} value={address.name}>
                  {address.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Akcija dugmadi */}
        <div className="mt-auto flex gap-2 border-t border-gray-300 pt-4 justify-end">
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-lg cursor-pointer"
            onClick={onClose} // Zatvori modal
          >
            Otkaži
          </button>
          
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg cursor-pointer"
            onClick={rezervisiTermin} // Pozivanje funkcije za zakazivanje termina
          >
            Zakaži
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZakazivanjeTermina;
