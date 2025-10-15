'use client';
import { useState, useRef, useEffect } from "react";

// AŽURIRANO: Dodajemo novi tab 'Usluge'
const tabs = ['Osnovne informacije', 'Zaposleni', 'Inventar', 'Usluge'];

// Fiksna lista lokala za primer (nepromenjena)
const salons = [
    { 
        id: 1, 
        name: "Salon lepote 'GlowUp' - Centar", 
        address: "Bulevar Kralja Aleksandra 123, Beograd",
        supplyStatus: "U redu", 
        dailyTarget: 45000 
    },
    { 
        id: 2, 
        name: "Salon lepote 'GlowUp' - Novi Beograd", 
        address: "Jurija Gagarina 22, Novi Beograd",
        supplyStatus: "Zahteva proveru", 
        dailyTarget: 38000 
    },
];

// NOVO: Lista usluga sa dodatkom lokacijaId
const allServices = [
    { id: 1, name: "Kratka frizura", price: 1500, lokacijaId: 1, category: "Frizerske" }, // Centar
    { id: 2, name: "Duga frizura", price: 2500, lokacijaId: 1, category: "Frizerske" }, // Centar
    { id: 3, name: "Pranje kose", price: 500, lokacijaId: 1, category: "Frizerske" }, // Centar
    { id: 4, name: "Farbanje kose", price: 3000, lokacijaId: 1, category: "Frizerske" }, // Centar
    { id: 5, name: "Presa frizura", price: 2000, lokacijaId: 2, category: "Frizerske" }, // Novi Beograd
    { id: 6, name: "Kosu sa peglom", price: 1800, lokacijaId: 2, category: "Frizerske" }, // Novi Beograd
    { id: 7, name: "Regeneracija kose", price: 1200, lokacijaId: 1, category: "Frizerske" }, // Centar
    { id: 8, name: "Balayage", price: 3500, lokacijaId: 2, category: "Frizerske" }, // Novi Beograd
    { id: 9, name: "Keratin tretman", price: 4000, lokacijaId: 2, category: "Frizerske" }, // Novi Beograd
    { id: 10, name: "Manikir", price: 1000, lokacijaId: 1, category: "Kozmetičke" }, // Centar
    { id: 11, name: "Pedikir", price: 1200, lokacijaId: 2, category: "Kozmetičke" }, // Novi Beograd
    { id: 12, name: "Depilacija", price: 800, lokacijaId: 2, category: "Kozmetičke" }, // Novi Beograd
];

export default function SalonPage() {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const tabRefs = useRef<(HTMLButtonElement | null)[]>(Array(tabs.length).fill(null));

    const [selectedSalonId, setSelectedSalonId] = useState(salons[0].id);
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
    
    // --- Zaposleni Logika - AŽURIRANO SA STVARNIM PODACIMA ---
    const [searchTerm, setSearchTerm] = useState("");
    const employees = [
        { ime: "Jovana Nikolić", uloga: "Frizer", status: "Aktivan", telefon: "+381601112233", email: "jovana@glowup.rs", datum: "01.02.2022", lokacijaId: 1 }, 
        { ime: "Marko Ilić", uloga: "Recepcioner", status: "Na odmoru", telefon: "+381601234567", email: "marko@glowup.rs", datum: "15.07.2023", lokacijaId: 1 }, 
        { ime: "Ana Petrović", uloga: "Kozmetičar", status: "Aktivan", telefon: "+381602224466", email: "ana@glowup.rs", datum: "10.05.2021", lokacijaId: 2 },
        { ime: "Petar Jovanović", uloga: "Frizer", status: "Aktivan", telefon: "+381603335577", email: "petar@glowup.rs", datum: "05.11.2023", lokacijaId: 2 }
    ]; 
    const filteredEmployees = employees
        .filter((zaposleni) => zaposleni.lokacijaId === selectedSalonId)
        .filter((zaposleni) => {
            return (
                zaposleni.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                zaposleni.uloga.toLowerCase().includes(searchTerm.toLowerCase()) ||
                zaposleni.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

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

    // --- Usluge Logika (NEPROMENJENA, radi kako treba) ---
    const [searchServiceTerm, setSearchServiceTerm] = useState("");

    const filteredServices = allServices
        .filter((service) => service.lokacijaId === selectedSalonId)
        .filter((service) => {
            return (
                service.name.toLowerCase().includes(searchServiceTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchServiceTerm.toLowerCase())
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Osnovne informacije':
                return (
                    <div className="space-y-2">
                        <p><strong>Naziv:</strong> {selectedSalon?.name}</p>
                        <p><strong>Adresa:</strong> {selectedSalon?.address}</p>
                        <p><strong>Telefon:</strong> +381 60 1234567</p>
                        <p><strong>Email:</strong> kontakt@glowup.rs</p>
                        <p><strong>Menadžer:</strong> Milica Petrović</p>
                        
                        <p>
                            <strong>Dnevni cilj:</strong> 
                            <span className="ml-1 text-blue-600 font-semibold">
                                {formatCurrency(selectedSalon?.dailyTarget || 0)}
                            </span>
                        </p>
                        
                        {/* BROJ ZAPOSLENIH - Sada koristi stvarne podatke */}
                        <p><strong>Broj zaposlenih:</strong> {filteredEmployees.length}</p> 
                        <p>
                            {/* UKUPAN INVENTAR - Sada koristi stvarne podatke */}
                            <strong>Ukupan inventar:</strong> {filteredInventory.length} stavki 
                            <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                selectedSalon?.supplyStatus === 'U redu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                ({selectedSalon?.supplyStatus})
                            </span>
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
                        <div className="flex justify-end mb-4">
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
                                                    zaposleni.status === 'Aktivan' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {zaposleni.status}
                                                </span>
                                            </td>
                                            <td className="p-2 border">{zaposleni.telefon}</td>
                                            <td className="p-2 border">{zaposleni.email}</td>
                                            <td className="p-2 border">{zaposleni.datum}</td>
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
                        <div className="flex justify-end mb-4">
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
                        <div className="flex justify-end mb-4">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServices.map((service) => (
                                        <tr key={service.id} className="text-sm text-center">
                                            <td className="p-2 border">{service.name}</td>
                                            <td className="p-2 border">{service.category}</td>
                                            <td className="p-2 border font-semibold text-gray-700">
                                                {formatCurrency(service.price)}
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
                {/* 1. Deo: Tabovi (Sada sa 'Usluge') */}
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
                            value={selectedSalonId}
                            onChange={(e) => setSelectedSalonId(parseInt(e.target.value))}
                            className="p-1 border rounded text-sm font-medium bg-gray-50"
                        >
                            {salons.map((salon) => (
                                <option key={salon.id} value={salon.id}>
                                    {salon.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">{selectedSalon.address}</p>
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
        </div>
    );
}