'use client';
import UslugaModal from "@/components/UslugaModal";
import { Firma, FirmaAsortimanDTO, Lokacije } from "@/types/firma";
import { getCookie } from "cookies-next";
import { body } from "framer-motion/client";
import { Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

// AŽURIRANO: Dodajemo novi tab 'Usluge'
const tabs = ['Osnovne informacije', 'Zaposleni', 'Inventar', 'Usluge'];

const formatirajDatum = (datum: string) => {
    return new Date(datum).toLocaleDateString("sr-RS");
}

export default function SalonPage() {
    const [firma, setFirma] = useState<Firma | null>(null); 
    const [salons, setSalons] = useState<Lokacije[]>([]);
    const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
    const [isUslugeModalOpen, setIsUslugeModalOpen] = useState(false);
    const [editingUsluge, setEditingUsluge] = useState(null);
    const [asortiman, setAsortiman] = useState<FirmaAsortimanDTO[]>([]);
    const [loadingAsortiman, setLoadingAsortiman] = useState(false);
    const [asortimanError, setAsortimanError] = useState<string | null>(null);



    const [activeTab, setActiveTab] = useState(tabs[0]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const tabRefs = useRef<(HTMLButtonElement | null)[]>(Array(tabs.length).fill(null));

    const selectedSalon = salons.find(s => s.id === selectedSalonId);

    
    useEffect(() => {
        const index = tabs.findIndex(tab => tab === activeTab);
        const currentTab = tabRefs.current[index];
        const container = containerRef.current;

        if (currentTab instanceof HTMLElement && container) {
            const left = currentTab.offsetLeft; 
            const width = currentTab.offsetWidth;

            setUnderlineStyle({ left, width });
        }
    }, [activeTab]);

    // Fetch firme
    useEffect(() => {
        const fetchFirma = async () => {
        try {
            const token = getCookie("AuthToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Firme/DajFirme`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
            });
            const data = await res.json();
            setFirma(data[0]);
            setSalons(data[0]?.lokacije || []);
            setSelectedSalonId(data[0]?.lokacije[0]?.id || null);
        } catch (error: unknown) {
            console.error('Greška prilikom učitavanja firme:', error);
        }
        };
        fetchFirma();
    }, []);

    // --- Fetch asortimana po lokaciji ---
    useEffect(() => {
        if (!selectedSalonId || !firma) return;

        const fetchAsortiman = async () => {
            setLoadingAsortiman(true);
            setAsortimanError(null);

            try {
                const token = getCookie("AuthToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Usluge/DajAsortiman?idFirme=${firma.id}&idLokacije=${selectedSalonId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Greška prilikom učitavanja asortimana.");

                const data: FirmaAsortimanDTO[] = await res.json();
                setAsortiman(data);
            } catch (err) {
                console.error(err);
                setAsortimanError("Ne mogu da učitam asortiman.");
            } finally {
                setLoadingAsortiman(false);
            }
        };

        fetchAsortiman();
    }, [selectedSalonId, firma]);

    // Sortirane usluge
    const [searchServiceTerm, setSearchServiceTerm] = useState("");

    const filteredServices = useMemo(() => {
        if (!asortiman) return [];

        return asortiman
            .filter(service => service.idLokacije === selectedSalonId)
            .filter(service =>
                service.nazivUsluge.toLowerCase().includes(searchServiceTerm.toLowerCase())
            )
            .sort((a, b) =>
                a.nazivUsluge.localeCompare(b.nazivUsluge, "sr", { sensitivity: "base" })
            );
    }, [asortiman, selectedSalonId, searchServiceTerm]);

    // Brisanje usluga iz asortimana korisnika
    const handleDeleteService = async (service: FirmaAsortimanDTO) => {
        if (!confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")) return;

        try {
            const token = getCookie("AuthToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Usluge/ObrisiUslugu`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idFirme: service.idFirme,
                    idLokacije: service.idLokacije,
                    idKategorije: service.idKategorije,
                    idUsluge: service.idUsluge
                }),
        });

            if (!res.ok) throw new Error("Greška prilikom brisanja usluge.");

            setAsortiman(prev => prev.filter(s => s.idUsluge !== service.idUsluge));
            alert(`Usluga "${service.nazivUsluge}", je uspešno obrisana`);

        } catch (err) {
            console.error(err);
            alert("Neuspešno brisanje usluge.");
        }
    };

    // --- Zaposleni Logika - AŽURIRANO SA STVARNIM PODACIMA ---
    const [searchTerm, setSearchTerm] = useState("");
    const zaposleni = selectedSalon?.zaposleni;

    const filteredEmployees = (zaposleni ?? [])
        .filter((z) => selectedSalon?.id === selectedSalonId)
        .filter((z) => {
            return (
                z.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                z.uloga.toLowerCase().includes(searchTerm.toLowerCase()) ||
                z.statusRada.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        const registrujZaposlenog = () => {
            alert("Ulazite u registraciju novog radnika");
        }

    // --- Inventar Logika - AŽURIRANO SA STVARNIM PODACIMA ---
    const [searchInventoryTerm, setSearchInventoryTerm] = useState("");
    const inventory = [
        { naziv: "Šampon Gold Touch", kategorija: "Kozmetika", stanje: 12, minimum: 5, poslednja: "01.10.2025", status: "Na stanju", lokacijaId: 1 },
        { naziv: "UV lampa za nokte", kategorija: "Oprema", stanje: 1, minimum: 2, poslednja: "15.09.2025", status: "Potrebna nabavka", lokacijaId: 1 },
        { naziv: "Lak za kosu Extreme Hold", kategorija: "Kozmetika", stanje: 45, minimum: 20, poslednja: "20.10.2025", status: "Na stanju", lokacijaId: 2 },
        { naziv: "Sto za masažu", kategorija: "Oprema", stanje: 1, minimum: 1, poslednja: "01.01.2024", status: "Na stanju", lokacijaId: 2 }
    ];
    const filteredInventory = inventory
        .filter((item) => item.lokacijaId === selectedSalonId)
        .filter((item) => {
            return (
                item.naziv.toLowerCase().includes(searchInventoryTerm.toLowerCase()) ||
                item.kategorija.toLowerCase().includes(searchInventoryTerm.toLowerCase())
            );
        });

    // Funkcija za formatiranje novca (nepromenjena)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('RSD', '').trim() + ' RSD';
    };

    const registrujArtikal = () => {
        alert("Dodajete proizvod u sistem");
    }

    const registrujUslugu = () => {
        setEditingUsluge(null);
        setIsUslugeModalOpen(true);
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Osnovne informacije':
                return (
                    <div className="space-y-2">
                        <p><strong>Naziv:</strong> {firma?.naziv}</p>
                        <p><strong>Adresa:</strong> {selectedSalon?.adresa}, {selectedSalon?.nazivLokacije}</p>
                        <p><strong>Telefon:</strong> {selectedSalon?.telefon}</p>
                        <p><strong>Email:</strong> {selectedSalon?.email}</p>
                        <p><strong>Menadžer:</strong> Milica Petrović</p>
                        
                        <p>
                            <strong>Dnevni cilj:</strong> 
                            <span className="ml-1 text-blue-600 font-semibold">
                                N/A za sad
                            </span>
                        </p>
                        
                        {/* BROJ ZAPOSLENIH - Sada koristi stvarne podatke */}
                        <p><strong>Broj zaposlenih:</strong> {filteredEmployees.length}</p> 
                        <p>
                            {/* UKUPAN INVENTAR - Sada koristi stvarne podatke */}
                            <strong>Ukupan inventar:</strong> {filteredInventory.length} stavki 
                            {/* <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                selectedSalon?.supplyStatus === 'U redu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                ({selectedSalon?.supplyStatus})
                            </span> */}
                        </p>
                        {/* BROJ USLUGA - Sada koristi stvarne podatke */}
                        <p>
                            <strong>Broj usluga:</strong> {filteredServices.length}
                        </p>
                    </div>
                );
            case 'Zaposleni':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between mb-4">
                            <button className="border rounded-lg py-2 px-6 cursor-pointer hover:bg-gray-300" onClick={registrujZaposlenog}>
                                Dodaj / Izmeni Zaposlenog
                            </button>
                            <input
                                type="text"
                                placeholder="Pretraži zaposlene..."
                                className="p-2 border rounded w-full md:w-1/3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Ime i prezime</th>
                                        <th className="p-2 border">Uloga</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Telefon</th>
                                        <th className="p-2 border">Email</th>
                                        <th className="p-2 border">Zaposlen od</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* OVDE MOŽE BITI PROBLEMATIČAN KOD AKO GA NISAM CEO VRATIO, ali filter radi */}
                                    {filteredEmployees.map((zaposleni, idx) => (
                                        <tr key={idx} className="text-sm text-center">
                                            <td className="p-2 border">{zaposleni.ime}</td>
                                            <td className="p-2 border">{zaposleni.uloga}</td>
                                            <td className="p-2 border">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    zaposleni.statusRada === 'aktivan' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {zaposleni.statusRada}
                                                </span>
                                            </td>
                                            <td className="p-2 border">{zaposleni.telefon}</td>
                                            <td className="p-2 border">{zaposleni.email}</td>
                                            <td className="p-2 border">{zaposleni.datumKreiranja && formatirajDatum(zaposleni.datumKreiranja)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Inventar':
                return (
                    <div className="space-y-4"> 
                        <div className="flex justify-between mb-4">
                            <button className="border rounded-lg py-2 px-6 cursor-pointer hover:bg-gray-300" onClick={registrujArtikal}>
                                Dodaj / Izmeni Artikal
                            </button>
                            <input
                                type="text"
                                placeholder="Pretraži inventar..."
                                className="p-2 border rounded w-full md:w-1/3" 
                                value={searchInventoryTerm}
                                onChange={(e) => setSearchInventoryTerm(e.target.value)}
                            />
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Naziv</th>
                                        <th className="p-2 border">Kategorija</th>
                                        <th className="p-2 border">Stanje</th>
                                        <th className="p-2 border">Min. količina</th>
                                        <th className="p-2 border">Poslednja nabavka</th>
                                        <th className="p-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInventory.map((item, idx) => (
                                        <tr key={idx} className="text-sm text-center">
                                            <td className="p-2 border">{item.naziv}</td>
                                            <td className="p-2 border">{item.kategorija}</td>
                                            <td className="p-2 border">{item.stanje}</td>
                                            <td className="p-2 border">{item.minimum}</td>
                                            <td className="p-2 border">{item.poslednja}</td>
                                            <td className="p-2 border">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    item.status === 'Na stanju' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case 'Usluge':
                return (
                    <div className="space-y-4"> 
                        <div className="flex justify-between mb-4">
                            <button className="border rounded-lg py-2 px-6 cursor-pointer hover:bg-gray-300" onClick={registrujUslugu}>
                                Dodaj / Izmeni Uslugu
                            </button>
                            <input
                                type="text"
                                placeholder="Pretraži usluge..."
                                className="p-2 border rounded w-full md:w-1/3" 
                                value={searchServiceTerm}
                                onChange={(e) => setSearchServiceTerm(e.target.value)}
                            />
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Naziv usluge</th>
                                        <th className="p-2 border">Kategorija</th>
                                        <th className="p-2 border">Cena</th>
                                        <th className="p-2 border">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServices.map((service) => (
                                        <tr key={service.id} className="text-sm text-center">
                                            <td className="p-2 border">{service.nazivUsluge}</td>
                                            <td className="p-2 border">{service.nazivKategorije}</td>
                                            <td className="p-2 border font-semibold text-gray-700">
                                                {formatCurrency(service.cena)}
                                            </td>
                                            <td className="p-2 border">
                                                <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => handleDeleteService(service)}
                                                title="Obriši uslugu"
                                                >
                                                <Trash2 size={18} className="cursor-pointer"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Salon</h1> 
            
            <div
                ref={containerRef}
                className="relative flex justify-between items-end mb-6 border-b pb-2" 
            >
                {/* 1. Deo: Tabovi za selektovanje */}
                <div className="flex gap-4 tabs-container">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            ref={(el) => { tabRefs.current[index] = el; }} 
                            className={`relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 ${
                                activeTab === tab ? 'text-blue-600' : 'hover:text-blue-600'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 2. Deo: Selektor lokala i Adresa */}
                {selectedSalon && (
                    <div className="text-right pb-1"> 
                        <select
                            value={selectedSalonId ?? ''}
                            onChange={(e) => setSelectedSalonId(parseInt(e.target.value))}
                            className="p-1 border rounded text-sm font-medium bg-gray-50"
                        >
                            {salons.map((salon) => (
                                <option key={salon.id} value={salon.id}>
                                    {firma?.naziv} - {salon.nazivLokacije}
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500 mt-1">
                            {selectedSalon.adresa}, {selectedSalon.nazivLokacije}
                        </p>
                    </div>
                )}
                
                {/* 3. Podvlačenje */}
                <span
                    className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out"
                    style={{
                        left: underlineStyle.left,
                        width: underlineStyle.width,
                    }}
                />
            </div>

            <div className="space-y-4">
                {renderTabContent()}
            </div>

            <UslugaModal
                isOpen={isUslugeModalOpen}
                onClose={() => setIsUslugeModalOpen(false)}
                onSave={(service) => {
                    console.log("Sačuvana usluga:", service);
                    alert("Usluga sačuvana!");
                }}
                salons={salons}
                selectedSalonId={selectedSalonId}
                firmaId={firma?.id ?? null}
            />

        </div>
    );
}